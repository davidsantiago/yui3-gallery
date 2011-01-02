YUI.add('gallery-taglist', function(Y) {

/**
 * The Taglist Utility - Full documentation coming soon.
 *
 * @module gallery-taglist
 * requires : "base-build", "plugin", "node", "classnamemanager", "event"
 */
	var 
		//function alias'
		getClassName = Y.ClassNameManager.getClassName,
		createNode = Y.Node.create,
		
		//plugin info
		NAME = 'taglist',
		
		//contstants
		DELIM = ',',
		KEY_BACKSPACE = 8,
		KEY_ENTER = 13,
		KEY_COMMA = 188,
		KEY_SPACE = 32,
		ENTRY_NAME = 'taglistentry',
		CSS_CLEARFIX = getClassName('helper', 'clearfix'),
		CSS_ICON = getClassName('icon'),
		CSS_ICON_CLOSE = getClassName('icon', 'close'),
		CSS_ICON_EDIT = getClassName('icon', 'edit'),
		CSS_ENTRY_HOLDER = getClassName(ENTRY_NAME, 'holder'),
		CSS_ENTRY_CLOSE = getClassName(ENTRY_NAME, 'close'),
		CSS_ENTRY_EDIT = getClassName(ENTRY_NAME, 'edit'),
		CSS_ENTRY_TEXT = getClassName(ENTRY_NAME, 'text'),
		CSS_ENTRY_ITEM = getClassName(ENTRY_NAME, 'item'),
		CSS_INPUT_CONTAINER = getClassName(NAME, 'input', 'container'),
		TPL_ENTRY_CLOSE = '<span class="' + [CSS_ICON, CSS_ICON_CLOSE, CSS_ENTRY_CLOSE].join(' ') + '">Remove</span>',
		TPL_ENTRY_EDIT = '<span class="' + [CSS_ICON, CSS_ICON_EDIT, CSS_ENTRY_EDIT].join(' ') + '">Edit</span>',
		TPL_ENTRY_TEXT = '<span class="' + CSS_ENTRY_TEXT + '"></span>',
		TPL_ENTRY_HOLDER = '<ul class="' + [CSS_CLEARFIX, CSS_ENTRY_HOLDER].join(' ') + '"></ul>',	
		TPL_INPUT_CONTAINER = '<li class="' + CSS_INPUT_CONTAINER + '"></li>';
		
	
	Y[NAME] = Y.Base.create(NAME, Y.Plugin.Base, [], {
		
		//the host input field wich is plugged in
		oldInput : null,
		
		//the container that holds the new input
		inputContainer : createNode(TPL_INPUT_CONTAINER),
		
		//the new input
		input : createNode('<input></input>'),
		
		//the ul container
		cont : createNode(TPL_ENTRY_HOLDER),
		
		lis : [],
				
		entries : [],
		
		toString : function () {
			return '[Object ' + NAME + ']';
		},
		
		initializer : function () {
			
			this.oldInput = this.get('host');
			this.entries = [];
			this.lis = [];
			this._selected = -1;
			
			this.renderUI();
			this.bindUI();
			this.syncUI();
		},
		
		destructor : function () {
			
			this.oldInput.set('type', 'text');
			this.input.remove();
		},
		
		renderUI : function () {
			//add the input item
			this.inputContainer.appendChild(this.input);
			this.cont.append(this.inputContainer);
			//set the input values
			this.oldInput.set('type', 'hidden');
			this.input.set('value', this.oldInput.get('value'));
			this.oldInput.get('parentNode').appendChild(this.cont);
		},
		
		bindUI : function () {
			//the delegated listeners for the edit and delete spans
			this.cont.delegate('click', this.removeClick, 'span.' + CSS_ENTRY_CLOSE, this);
			this.cont.delegate('click', this.editClick, 'span.' + CSS_ENTRY_EDIT, this);
			//the blur event will do an add check
			this.input.on('blur', this.add, this);
			//if the container is clicked, focus on the firld
			this.cont.on('click', function () {
				this.input.focus();
			}, this);
			//keypress listeners
			Y.on(
				'key',
				this.keyDown,
				this.input,
				'down:' + [KEY_ENTER, KEY_BACKSPACE, KEY_COMMA, KEY_SPACE].join(','),
				this
			);
		},
		
		syncUI : function () {
			//do an add when we intialise as there may have been content added before the js fired
			this.add();
		},
		
		//the add helper method
		//this does the add
		_add : function (k) {
			var 
				add = (this.entries.length) ? this.oldInput.get('value') + DELIM + k : k,
				li = createNode('<li class="' + CSS_ENTRY_ITEM + '"></li>'),
				txt = createNode(TPL_ENTRY_TEXT);
			
			li.appendChild(txt.set('innerHTML', k));
			li.appendChild(createNode(TPL_ENTRY_EDIT));
			li.appendChild(createNode(TPL_ENTRY_CLOSE));
				
			this.oldInput.set('value', add);
			this.cont.insert(li, this.inputContainer, "before");
			this.entries.push(k);
			this.lis.push(li);
		},
		
		add : function () {
			var input = this.input.get('value'), a, al, ai;
			//first we need to clean up the inputs and remove any extra spaces
			input = input.replace(/, /g, ',');
			//is there anything to add?
			if (input.length) {
				a = input.split(',');
				for (ai = 0, al = a.length; ai < al; ai += 1) {
					this._add(a[ai]);
				}
				this.input.set('value', '');
			}
		},
		
		//get the index of a key in an array
		_getIndex : function (a, k) {
			var ai, al = a.length;
			for (ai = 0; ai < al; ai += 1) {
				if (a[ai] === k) {
					return ai;
				}
			}
			return -1;
		},
		
		remove : function (i) {
			var k = this.entries[i], r = (i) ? DELIM + k : k;
			if (k) {
				this.oldInput.set('value', this.oldInput.get('value').replace(r, ''));
				this.lis[i].remove(); //remove the li from the display
				this.entries.splice(i, 1); //removes that item from the array of entries
				this.lis.splice(i, 1); //removes that li from the array of lis
			}
			this.input.focus();
		},
		
		removeClick : function (e) {
			var el = e.target, i = this._getIndex(this.lis, el.get('parentNode'));
			if (i > -1) {
				this.remove(i);
			}
		},
		
		edit : function (i) {
			var k = this.entries[i];
			if (k) {
				this.remove(i);
				this.input.set('value', k);
			}
		},
		
		editClick : function (e) {
			var el = e.target, i = this._getIndex(this.lis, el.get('parentNode'));
			if (i > -1) {
				this.edit(i);
			}
		},
		
		keyDown : function (ev) {
			var 
				keyCode = ev.keyCode,
				entry = this.input.get('value'),
				entriesSize = this.entries.length;
				

			if (!entry) {
				//we will allow the enter key to work as per normal, if there is nothing to add
				if (keyCode === KEY_ENTER) {
					return;
				}
				//dont accept spaces as the first character
				if (keyCode === KEY_SPACE) {
					ev.halt();
				}
				//if you're pressing the backspace button, with no input, edit the last entry, if there is one
				if (keyCode === KEY_BACKSPACE && entriesSize) {
					//we dont want to delete the last character yet
					ev.halt();
					//edit the last one
					this.edit(entriesSize - 1);
				}
			}
			
			if (keyCode === KEY_ENTER || keyCode === KEY_COMMA) {
				//stop it from happening (that is a comma to appear, or the input to cause a form submit.)
				ev.halt();
				//we're going to treat these as an add
				if (entry) { 
					this.add();
				}
			}
			
		}
	}, 
	{
		NS : NAME,
		ATTRS : {}
	});


}, '@VERSION@' ,{requires:['base-build','plugin','node','classnamemanager','event']});
