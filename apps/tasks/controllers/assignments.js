// ==========================================================================
// Tasks.assignmentsController
// ==========================================================================
/*globals CoreTasks Tasks */

/** 

  This controller manages what is displayed in the Tasks detail screen.
  This is affected by the selected Project/User and the search criteria.
  
  @extends SC.ArrayController
  @author Joshua Holt
  @author Suvajit Gupta
*/

Tasks.attributeFilterNone = [
  CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG, CoreTasks.TASK_TYPE_OTHER,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM, CoreTasks.TASK_PRIORITY_LOW,
  CoreTasks.TASK_STATUS_PLANNED, CoreTasks.TASK_STATUS_ACTIVE, CoreTasks.TASK_STATUS_DONE, CoreTasks.TASK_STATUS_RISKY,
  CoreTasks.TASK_VALIDATION_UNTESTED, CoreTasks.TASK_VALIDATION_PASSED, CoreTasks.TASK_VALIDATION_FAILED
];

Tasks.attributeFilterTroubled = [
  CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG, CoreTasks.TASK_TYPE_OTHER,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM, CoreTasks.TASK_PRIORITY_LOW,
  CoreTasks.TASK_STATUS_DONE, CoreTasks.TASK_STATUS_RISKY,
  CoreTasks.TASK_VALIDATION_FAILED
];

Tasks.attributeFilterUnfinished = [
  CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG, CoreTasks.TASK_TYPE_OTHER,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM,
  CoreTasks.TASK_STATUS_PLANNED, CoreTasks.TASK_STATUS_ACTIVE, CoreTasks.TASK_STATUS_DONE, CoreTasks.TASK_STATUS_RISKY,
  CoreTasks.TASK_VALIDATION_FAILED
];

Tasks.attributeFilterUnvalidated = [
  CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM, CoreTasks.TASK_PRIORITY_LOW,
  CoreTasks.TASK_STATUS_DONE,
  CoreTasks.TASK_VALIDATION_UNTESTED
];

Tasks.attributeFilterVerified = [
CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG, CoreTasks.TASK_TYPE_OTHER,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM, CoreTasks.TASK_PRIORITY_LOW,
  CoreTasks.TASK_STATUS_DONE,
  CoreTasks.TASK_VALIDATION_PASSED
];

Tasks.attributeFilterShowstoppers = [
  CoreTasks.TASK_TYPE_BUG,
  CoreTasks.TASK_PRIORITY_HIGH,
  CoreTasks.TASK_STATUS_PLANNED, CoreTasks.TASK_STATUS_ACTIVE, CoreTasks.TASK_STATUS_DONE, CoreTasks.TASK_STATUS_RISKY,
  CoreTasks.TASK_VALIDATION_FAILED
];

Tasks.DISPLAY_MODE_TEAM = false;
Tasks.DISPLAY_MODE_TASKS = true;

Tasks.assignmentsController = SC.ArrayController.create(
/** @scope Tasks.assignmentsController.prototype */ {
  
  contentBinding: 'Tasks.projectController.tasks',
  assignedTasks: null,
  _showTasks: true,
  _clearingAssigneeSelection: false,
  displayMode: function(key, value) {
    if (value !== undefined) {
      if(value === false) { // clear assignee selection before going to Summmary mode
        var assigneeSelection = this.get('assigneeSelection');
        if(assigneeSelection !== null && assigneeSelection !== '') {
          this._clearingAssigneeSelection = true;
          this.set('assigneeSelection', null);
        }
      }
      this.set('_showTasks', value);
    } else {
      return this.get('_showTasks');
    }
  }.property('_showTasks').cacheable(),
  
  assigneeSelection: null,
  searchFilter: null,
  attributeFilterCriteria: Tasks.attributeFilterNone.slice(0),
  
  attributeFilter: function(name, value) {
    var newFilterCriteria;
    if (value !== undefined) {
      if(value) { // if not included, add attribute to filter
        if(this.attributeFilterCriteria.indexOf(name) === -1) {
          newFilterCriteria = this.attributeFilterCriteria.splice(0);
          newFilterCriteria.push(name);
          this.set('attributeFilterCriteria', newFilterCriteria);
        }
      }
      else { // if included, remove attribute from filter
        var idx = this.attributeFilterCriteria.indexOf(name);
        if (idx !== -1) {
          newFilterCriteria = this.attributeFilterCriteria.splice(0);
          newFilterCriteria.splice(idx, 1);
          this.set('attributeFilterCriteria', newFilterCriteria);
        }
      }
      return this;
    }
    else { // see if attribute is in filter
      return (this.attributeFilterCriteria.indexOf(name) !== -1);
    }
  },
  
  attributeFilterTypeFeature: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_FEATURE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterTypeBug: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_BUG, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterTypeOther: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_OTHER, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityHigh: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_HIGH, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityMedium: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_MEDIUM, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityLow: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_LOW, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusPlanned: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_PLANNED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusActive: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_ACTIVE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusDone: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_DONE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusRisky: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_RISKY, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationUntested: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_UNTESTED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationPassed: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_PASSED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationFailed: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_FAILED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterCriteriaCopy: null,
  
  backupAttributeFilterCriteria: function() {
    this.attributeFilterCriteriaCopy = this.attributeFilterCriteria.slice(0);
  },
  
  restoreAttributeFilterCriteria: function() {
    this.set('attributeFilterCriteria', this.attributeFilterCriteriaCopy);
  },
  
  attributeFilterIcon: function() {
    return this.attributeFilterCriteria.length === 13? 'filter-tasks-icon-no-criteria' : 'filter-tasks-icon-has-criteria';
  }.property('attributeFilterCriteria'),
  
  hasFiltering: function() {
    return this.assigneeSelection || this.searchFilter || this.attributeFilterCriteria.length !== 13;
  },
  
  setAttributeFilterTroubled: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterTroubled.slice(0));
  },

  setAttributeFilterUnfinished: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterUnfinished.slice(0));
  },

  setAttributeFilterUnvalidated: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterUnvalidated.slice(0));
  },

  setAttributeFilterVerified: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterVerified.slice(0));
  },

  setAttributeFilterShowstoppers: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterShowstoppers.slice(0));
  },

  setAttributeFilterNone: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterNone.slice(0));
  },

  resetFilters: function() {
    this.set('assigneeSelection', null);
    this.set('searchFilter', null);
    this.setAttributeFilterNone();
  },
  
  
  // count: 0, // used for tracking/tuning calls to redraw tasks pane below
  showAssignments: function() { // show tasks for selected user that matches search filter
   
    // console.log("DEBUG: showAssignments(" + this.count + ") entry at: " + new Date().format('hh:mm:ss a'));
    
    // Extract selected assignee users whose tasks are to be displayed
    var selection = Tasks.tasksController.get('selection');
    
    var selectedAssigneeDisplayNames = [];
    var selectedAssignees = this.get('assigneeSelection');
    if (selectedAssignees) {
      var selectedAssigneeNames = selectedAssignees.replace(/,/g, ' ').replace(/\s+/g, ' ').replace(/\s+$/, '').split(' ');
      for (var i = 0; i < selectedAssigneeNames.length; i++) {
        if(selectedAssigneeNames[i].match(/none/i)) {
          selectedAssigneeDisplayNames.push(CoreTasks.USER_UNASSIGNED);
        }
        else {
          var selectedAssigneeUsers = CoreTasks.getUsers(selectedAssigneeNames[i]);
          if (selectedAssigneeUsers.length > 0) {
            for (var j = 0; j < selectedAssigneeUsers.length; j++) {
              selectedAssigneeDisplayNames.push(selectedAssigneeUsers[j].get('displayName'));
            }
          }
        }
      }
    }
    
    // Extract task name search filter
    var sf = this.get('searchFilter');
    sf = this._escapeMetacharacters(sf);
    var idPattern = null, namePattern = null, inverseSearch = false;
    var idMatches = sf.match(/#([\-\d]+)/g);
    // console.log("DEBUG: idMatches = " + idMatches);
    if(!idMatches) {
      if (sf.indexOf('^') === 0) { // inverse search requested
        inverseSearch = true;
        sf = sf.slice(1);
      }
      namePattern = new RegExp(sf, 'i');
    }
    
    // Get time left, if any specified, in selected project.
    var projectTimeLeft = null;
    var sel = Tasks.getPath('projectsController.selection');
    if (sel && sel.length() > 0) {
      var project = sel.firstObject();
      if (project) projectTimeLeft = CoreTasks.convertTimeToDays(project.get('timeLeft'));
    }
      
    // Group tasks by user & separate unassigned tasks
    var assignees = {}, assigneeName, assignee, assignmentNodes = [];
    this.forEach(function(task){
      if(!task) return;  // FIXME: [SC] unclear why task is null at times
      // console.log("Task Name: " + task.get('name') + "; Id: " + task.get('id'));
      assignee = task.get('assignee');
      var taskName = task.get('name');
      var isNewTask = (taskName === CoreTasks.NEW_TASK_NAME.loc()); // Always display "new task"s
      if (assignee && !assignee.get) return; // FIXME: [SC] unclear why assigneee.get is null at times
      assigneeName = assignee? assignee.get('displayName') : CoreTasks.USER_UNASSIGNED;
      if(isNewTask || selectedAssigneeDisplayNames.length === 0 || selectedAssigneeDisplayNames.indexOf(assigneeName) !== -1) {
        var assigneeObj = assignees[assigneeName];
        if(!assigneeObj) {
          assigneeObj = { assignee: assignee, tasks: [] };
          assignees[assigneeName] = assigneeObj;
        }
        
        // Filter tasks that meet filter criteria
        if(!isNewTask) {
          var type = task.get('type');
          if(this.attributeFilterCriteria.indexOf(type) === -1) return;
          var priority = task.get('priority');
          if(this.attributeFilterCriteria.indexOf(priority) === -1) return;
          var developmentStatus = task.get('developmentStatus');
          if(this.attributeFilterCriteria.indexOf(developmentStatus) === -1) return;
          if(developmentStatus === CoreTasks.TASK_STATUS_DONE) {
            var validation = task.get('validation');
            if(this.attributeFilterCriteria.indexOf(validation) === -1) return;
          }
          if(idMatches) {
            var taskId = task.get('displayId');
            if(idMatches.indexOf(taskId) === -1) { // doesn't match task ID exactly
              // see if any task ID entered in the search is a part of the task name
              var taskNameHasID = false;
              for (var i = 0; !taskNameHasID && i < idMatches.length; i++) {
                var taskIdMatches = taskName.match(/#([\-\d]+)/g);
                if(taskIdMatches) { // task name has ID(s) in it
                  for (var j=0; j < taskIdMatches.length; j++) {
                    if(taskIdMatches[j] === idMatches[i]) { // found match!
                      taskNameHasID = true;
                      break;
                    }
                  }
                }
              }
              if(!taskNameHasID) return;
            }
          }
          else if(namePattern) {
            var nameMatches = taskName.match(namePattern); // first try to search in name
            if((nameMatches && inverseSearch) || (!nameMatches && !inverseSearch)) { // then try to search in description
              var taskDescription = task.get('description');
              if(!taskDescription) return; // no description, cannot match
              var descriptionMatches = taskDescription.match(namePattern);
              if((descriptionMatches && inverseSearch) || (!descriptionMatches && !inverseSearch)) return; // no match found
            }
          }
        }
        assigneeObj.tasks.push(task);
      }
    }, this);
  
    for(assigneeName in assignees){
      if(assignees.hasOwnProperty(assigneeName)) {
          this._createAssignmentNode(assignmentNodes, assigneeName, assignees[assigneeName], projectTimeLeft);
      }
    }
      
    // Sort grouped tasks by assignee
    this.set('assignedTasks', SC.Object.create({ treeItemChildren: assignmentNodes.sort(function(a,b) {
      if(!Tasks.assignmentsController._showTasks) { // Team display mode, first try to sort in descending order of loading/red flags
        if(a.loading != CoreTasks.USER_NOT_LOADED && b.loading != CoreTasks.USER_NOT_LOADED) {
          var loadingDelta = b.effortGapPercent - a.effortGapPercent;
          if(loadingDelta !== 0) return loadingDelta;
          var redFlagsDelta = (b.riskyTasksCount + b.failedTasksCount) - (a.riskyTasksCount + a.failedTasksCount);
          if(redFlagsDelta !== 0) return redFlagsDelta;
        }
        else if(b.loading === CoreTasks.USER_NOT_LOADED && a.loading !== CoreTasks.USER_NOT_LOADED) {
          return -1;
        }
        else if(b.loading !== CoreTasks.USER_NOT_LOADED && a.loading === CoreTasks.USER_NOT_LOADED) {
          return 1;
        }
      }
      // Alpha sort by display names
      if (a.displayName === b.displayName) return 0;
      return (a.displayName > b.displayName) ? 1 : -1;
    }), treeItemIsExpanded: YES }));
    
    if(selection) Tasks.tasksController.selectObjects(selection);
    // console.log("DEBUG: showAssignments(" + this.count++ + ") exit  at: " + new Date().format('hh:mm:ss a'));

  },
  
  _escapeMetacharacters: function(str){
    var metaCharacters = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ];
    var s = new RegExp('(\\' + metaCharacters.join('|\\') + ')', 'g');
    return str? str.replace(s, '\\$1') : '';
  },
  
  /**
   * Create a node in the tree showing a user's tasks.
   *
   * @param {Array} set of assignment nodes.
   * @param {String} assignee name.
   * @param {Object} a hash of assignee ID and tasks array.
   * @param {Number} amount of time left in project.
   * @returns {Object) return a node to be inserted into the tree view.
   */
  _createAssignmentNode: function(assignmentNodes, assigneeName, assigneeObj, projectTimeLeft) {
    
    var taskWithUnspecifiedEffort = false, doneTaskWithUnspecifiedEffort = false;
    var displayName = assigneeName;
    var effortString, totalDoneEffortMin = 0, totalDoneEffortMax = 0, totalEffortMin = 0, totalEffortMax = 0, effortMin, effortMax;
    var task, tasks = assigneeObj.tasks;
    var len = tasks.get('length');
    var riskyTasksCount = 0;
    var failedTasksCount = 0;
    if (len === 0) return; // nothing to do
    
    for (var i = 0; i < len; i++) {
      
      task = tasks.objectAt(i);
      
      // Add observers to certain task properties that can require the assignmentsController to redraw
      // FIXME: [SC] see why bindings are firing multiple times when only one property is changed
      task.removeObserver('assignee',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('name',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('type',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('priority',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('developmentStatus',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('validation',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('effort',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('assignee',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('name',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('type',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('priority',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('developmentStatus',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('validation',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('effort',Tasks.assignmentsController,'_contentHasChanged');
      
      // Extract/total effort for each taek (simple number or a range)
      effortString = task.get('effort');
      var priority = task.get('priority');
      var developmentStatus = task.get('developmentStatus');
      if(developmentStatus === CoreTasks.TASK_STATUS_RISKY) riskyTasksCount++;
      var validation = task.get('validation');
      if(validation === CoreTasks.TASK_VALIDATION_FAILED) failedTasksCount++;
      if(!effortString && priority !== CoreTasks.TASK_PRIORITY_LOW) {
        if(developmentStatus === CoreTasks.TASK_STATUS_DONE) doneTaskWithUnspecifiedEffort = true;
        else taskWithUnspecifiedEffort = true;
      }
      if(effortString) { // sum up task effort
        var timeUnit = CoreTasks.getTimeUnit(effortString);
        effortMin = parseFloat(parseFloat(effortString, 10).toFixed(3));
        effortMin = CoreTasks.convertTimeToDays(effortMin + timeUnit);
        var idx = effortString.indexOf('-'); // see if effort is a range
        if(idx === -1) { // not a range
          effortMax = effortMin;
        }
        else { // effort IS a range, extract max
          effortMax = parseFloat(parseFloat(effortString.slice(idx+1), 10).toFixed(3));
          effortMax = CoreTasks.convertTimeToDays(effortMax + timeUnit);
        }
        if(developmentStatus === CoreTasks.TASK_STATUS_DONE && validation !== CoreTasks.TASK_VALIDATION_FAILED) {
          totalDoneEffortMin = parseFloat((totalDoneEffortMin + effortMin).toFixed(3));
          totalDoneEffortMax = parseFloat((totalDoneEffortMax + effortMax).toFixed(3));
        }
        else if (priority !== CoreTasks.TASK_PRIORITY_LOW) { // leave out Low priority items in totals
          totalEffortMin = parseFloat((totalEffortMin + effortMin).toFixed(3));
          totalEffortMax = parseFloat((totalEffortMax + effortMax).toFixed(3));
        }
      }
    }
  
    var displayEffort = '';
    if(totalDoneEffortMin !== 0) {
      var totalDoneEffort = '' + parseFloat(totalDoneEffortMin.toFixed(1));
      if (totalDoneEffortMax !== totalDoneEffortMin) {
        totalDoneEffort += '-' + parseFloat(totalDoneEffortMax.toFixed(1));
      }
      displayEffort = "_Done".loc() + ': ' + CoreTasks.displayTime(totalDoneEffort) + (doneTaskWithUnspecifiedEffort? '?' : '');
    }
    
    var loading = CoreTasks.USER_NOT_LOADED;
    var effortGap = 0, effortGapPercent = 0;
    if(totalEffortMin !== 0) {
      if(projectTimeLeft) { // flag user loading
        var totalEffortAve = (totalEffortMin + totalEffortMax)/2;
        effortGap = totalEffortAve - projectTimeLeft;
        effortGapPercent = 100*effortGap/projectTimeLeft;
        if(effortGap < 1 && effortGapPercent < -15) loading = CoreTasks.USER_UNDER_LOADED;
        else if(effortGap > 1 && effortGapPercent > 15) loading = CoreTasks.USER_OVER_LOADED;
        else loading = CoreTasks.USER_PROPERLY_LOADED;
      }
      var totalEffort = '' + parseFloat(totalEffortMin.toFixed(1));
      if (totalEffortMax !== totalEffortMin) {
        totalEffort += '-' + parseFloat(totalEffortMax.toFixed(1));
      }
      if(displayEffort !== '') displayEffort += ', ';
      displayEffort += "_Todo".loc() + ': ' + CoreTasks.displayTime(totalEffort) + (taskWithUnspecifiedEffort? '?' : '');
    }
    
    assignmentNodes.push (SC.Object.create({
      displayName: displayName,
      displayEffort: displayEffort === ''? null : displayEffort,
      effortGapPercent: effortGapPercent,
      riskyTasksCount:  riskyTasksCount,
      failedTasksCount:  failedTasksCount,
      loading: loading,
      assignee: assigneeObj.assignee,
      tasksCount: tasks.get('length'),
      treeItemChildren: Tasks.assignmentsController._showTasks? tasks.sort(function(a,b) {
        // sort by status, then by validation (if "Done"), then by priority, lastly by type
        
        var aStatus = a.get('developmentStatus');
        var bStatus = b.get('developmentStatus');
        if(aStatus !== bStatus) return CoreTasks.taskStatusWeights[bStatus] - CoreTasks.taskStatusWeights[aStatus];
        
        if(aStatus === CoreTasks.TASK_STATUS_DONE) {
          var aValidation = a.get('validation');
          var bValidation = b.get('validation');
          if(aValidation !== bValidation) return CoreTasks.taskValidationWeights[bValidation] - CoreTasks.taskValidationWeights[aValidation];
        }
        
        var aPriority = a.get('priority');
        var bPriority = b.get('priority');
        if(aPriority !== bPriority) return CoreTasks.taskPriorityWeights[bPriority] - CoreTasks.taskPriorityWeights[aPriority];
        
        var aType = a.get('type');
        var bType = b.get('type');
        if(aType !== bType) return CoreTasks.taskTypeWeights[bType] - CoreTasks.taskTypeWeights[aType];
        
        var aID = a.get('id');
        var bID = b.get('id');
        if(aID < 0 && bID < 0) return bID - aID;
        else if(aID < 0) return 1;
        else if(bID < 0) return -1;
        else return aID - bID;
        
      }) : null,
      treeItemIsExpanded: true
    }));
  },
  
  _timer: null,
  
  _contentHasChanged: function() {
    // console.log("DEBUG: Tasks content changed at: " + new Date().format('hh:mm:ss a'));
  	if (this._timer) { // called as a result of a timer set for assignee selection or search filter changes
      this._timer.invalidate();
      this._timer = null;
    }
  	this.invokeOnce(this.showAssignments);
  }.observes('[]', '_showTasks'),
  
  _filteringHasChanged: function() { // allow users to change filters over a half second before redrawing tasks pane
    if (this._timer) this._timer.invalidate();
    this._timer = this.invokeLater(this._contentHasChanged, 500);
  },
  
  _assigneeSelectionHasChanged: function() {
    // console.log("DEBUG: Assignee selection changed to '" + this.assigneeSelection + "'" + " displayDetails = " + this.get('_showTasks'));
    if(!this.get('_showTasks') && !this._clearingAssigneeSelection) {
      this.set('_showTasks', true);
    }
    this._clearingAssigneeSelection = false;
    this._filteringHasChanged();
  }.observes('assigneeSelection'),
  
  _searchFilterHasChanged: function() {
    // console.log("DEBUG: Search filter changed to '" + this.searchFilter + "'");
    this._filteringHasChanged();
  }.observes('searchFilter')
  
});
