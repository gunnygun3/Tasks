/*globals CoreTasks sc_require */

sc_require('models/record');

CoreTasks.NEW_PROJECT_NAME = '_NewProject';
CoreTasks.ALL_TASKS_NAME = '_AllTasks';
CoreTasks.UNALLOCATED_TASKS_NAME = '_UnallocatedTasks';

/**
 * The project model.
 *
 * A project is a container for tasks
 *
 * @extends CoreTasks.Record
 * @author Suvajit Gupta
 * @author Sean Eidemiller
 */
CoreTasks.Project = CoreTasks.Record.extend(/** @scope CoreTasks.Project.prototype */ {

  /**
   * The name of the project (ex. "FR1").
   */
  name: SC.Record.attr(String, { isRequired: YES, defaultValue: CoreTasks.NEW_PROJECT_NAME }),

  /**
   * The amount of time remaining before project completion, expressed in days.
   *
   * This is used for load-balancing.
   */
  timeLeft: SC.Record.attr(String),

  /**
   * Append unit of time after time left.
   */
  displayTimeLeft: function() {
    return CoreTasks.displayTime(this.get('timeLeft'));
  }.property('timeLeft').cacheable(),
  
  /**
   * A read-only computed property that returns the list of tasks associated with this project.
   *
   * @returns {SC.RecordArray} An array of tasks.
   */
  // FIXME: [SC] Beta: see why this is not recomputing when tasks are added/deleted - icon not redrawing as a result
  tasks: function() {

    // Create the query if necessary.
    if (!this._tasksQuery) {
      if(this.get('name') === CoreTasks.ALL_TASKS_NAME.loc()) {
        this._tasksQuery = SC.Query.local(CoreTasks.Task);
      }
      else if(this.get('name') === CoreTasks.UNALLOCATED_TASKS_NAME.loc()) {
        this._tasksQuery = SC.Query.local(CoreTasks.Task, 'projectId=null');
      }
      else {
        this._tasksQuery = SC.Query.local(CoreTasks.Task, "projectId='%@'".fmt(this.get('id')));
      }
    }

    // Execute the query and return the results.
    return this.get('store').find(this._tasksQuery);

  }.property('id').cacheable(),

  /**
   * A read-only computed property that returns the list of tasks allocated to this project
   * before it was first persisted.
   *
   * @returns {SC.RecordArray} An array of tasks.
   */
  disassociatedTasks: function() {
    // Create the query if necessary.
    if (!this._disassociatedAllocatedTasksQuery) {
      this._disassociatedAllocatedTasksQuery = SC.Query.local(CoreTasks.Task,
        "projectId='%@'".fmt(this.get('_id')));
    }

    // Execute the query and return the results.
    return this.get('store').find(this._disassociatedAllocatedTasksQuery);

  }.property('_id').cacheable(),

  /**
   * The path to the icon associated with a project.
   */
  icon: function() {
    if(this.get('tasks').get('length') > 0) return 'project-icon-has-tasks';
    else return 'project-icon-no-tasks';
  }.property('tasks'),

  /**
   * A string summarizing key facets of the Project for display.
   */
  displayName: function(key, value) {
    if (value !== undefined) {
      
      var currentName = this.get('name');
      var projectHash = CoreTasks.Project.parse(value);
      // console.log("PARSED PROJECT: " + JSON.stringify(projectHash));
      
      this.propertyWillChange('name');
      this.writeAttribute('name', projectHash.name);
      this.propertyDidChange('name');
      
      if(projectHash.timeLeft) {
        this.propertyWillChange('timeLeft');
        this.writeAttribute('timeLeft', projectHash.timeLeft);
        this.propertyDidChange('timeLeft');
      }
      
    } else {
      return this.get('name');
    }
    
  }.property('name').cacheable(),

  /**
   * Export a project's attributes.
   *
   * @returns {String) A string with the project's data exported in it.
   */
  exportData: function() {
    var projectName = this.get('name');
    var tasksCount = this.get('tasks').get('length');
    var ret;
    if(projectName === CoreTasks.UNALLOCATED_TASKS_NAME.loc()) {
      ret = '# ' + "_Has".loc() + tasksCount + "_Unallocated".loc() + "_Tasks".loc();
    }
    else {
      ret = projectName;
      var timeLeft = this.get('timeLeft');
      if(timeLeft) ret += (' {' + CoreTasks.displayTime(timeLeft) + '}');
      ret += ' # ' + "_Has".loc() + tasksCount + "_Tasks".loc();
    }
    return ret + '\n';
  },
  
  /**
   * Destroys the project and orphans any tasks that are in it.
   */
  destroy: function() {
    sc_super();

    var tasks = this.get('tasks');
    if (tasks) {
      tasks.forEach(function(task) {
        task.set('projectId', null);
      });
      this.get('tasks').destroy();
      this._tasksQuery = null;
    }
  }

});

CoreTasks.Project.mixin(/** @scope CoreTasks.Project */ {
  
  callbacks: SC.Object.create(),
  resourcePath: 'project',

  /**
   * Parse a line of text and extract parameters from it.
   *
   * @param {String} string to extract parameters from.
   * @returns {Object} Hash of parsed parameters.
   */
  parse: function(line) {
    var projectName = line, projectTimeLeft = null, projectTimeUnit = 'd';
    var projectMatches = line.match(/([^\{]+)\{(\d+\.\d+|\d+)(|d|h)\}/);
    if(projectMatches) {
      projectName = projectMatches[1];
      projectTimeLeft = projectMatches[2];
      if(projectMatches[3]) projectTimeLeft += projectMatches[3];
    }
    return {
      name: projectName.replace(/\s+$/, ''),
      timeLeft: projectTimeLeft,
      tasks: []
    };
  }
  
});
