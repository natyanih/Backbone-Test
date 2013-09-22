(function ($, BB, _) {

	$('#add_contact').tooltip();

	var editContact;

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson',
			'click .delete': 'deletePerson',
			'click .edit': 'editPerson',
			'click .cancel': 'cancelEdit',
			'click .done': 'updatePerson'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
			this.inputs = $(':input');

			this.listenTo(this.collection, 'add', this.renderView);

			this.collection.fetch();
		},

		renderView: function(model){

			position = this.collection.indexOf(model) + 1;
			model.set("num", position);
			var view = new PersonView({model: model});
			this.contacts_list.append(view.render().el);

			this.inputs.val(''); // clear fields
			
			if(this.warning) {
				this.warning.hide(); // hide warning
			}

			this.input_name.focus();
		},


		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			// check for duplicate username
			// findWhere for first result
			if(this.collection.findWhere({username: this.input_username.val()})){
				// append notification for duplicate username, set this.warning
				if(!this.warning){ // warning not yet displayed
				this.input_username.after("<br /><span style='color:red' id='warning'> Username already in use.</a>");
				this.warning = $('#warning');
				}
				this.input_username.focus();
			}

			else{
				this.collection.add(person);
				person.save();
			}
		},

		deletePerson: function(evt) {
			// get value of position - text of first child of parent tr
			var delPos = parseInt($(evt.target).closest('tr').children(":first").text());

			var deleteContact = this.collection.findWhere({num: delPos});

			deleteContact.destroy();

			$(evt.target).parents('tr').remove();
		},

		editPerson: function(evt) {

			// if confirmation class exist, cancel editing of first item
			if($('.confirmation').length > 0 ) {
				$( ".cancel" ).trigger( "click" );
			} 

			// get value of position - text of first child of parent tr
			var editPos = parseInt($(evt.target).closest('tr').children(":first").text());
			editContact = this.collection.findWhere({num: editPos});
			
			// set position value to collection num value
			position = editContact.get("num");
			
			// render edit template
			var view = new editPersonView({model: editContact});
			$(evt.target).closest('tr').replaceWith(view.render().el);

			// focus on full name
			if($('#fullnameedit').length)
				$('#fullnameedit').focus();
		},

		updatePerson: function(evt) {
			var newName = $(evt.target).parents('tr').find('input[name=fullname]').val();
			var newNumber = $(evt.target).parents('tr').find('input[name=number]').val();
			var newUsername = $(evt.target).parents('tr').find('input[name=username]');

			// if username exists in collection AND it's not equal to original username
			if (this.collection.findWhere({username: newUsername.val()}) && newUsername.val() != editContact.get("username") ) {
				// new username exist in collection
				if(!this.warning){ // warning not yet displayed
					newUsername.after("<br /><span style='color:red' id='warning'> Username already in use.</a>");
					this.warning = $('#warning');
				}
				// focus on user name
				if($('#usernameedit').length)
					$('#usernameedit').focus();
			} 

			else {
				editContact.set({
					name: newName,
					number: newNumber,
					username: newUsername.val(),
					num: position
				});
				editContact.save();
				var view = new PersonView({model: editContact});
				$(evt.target).parents('tr').replaceWith(view.render().el);
			}	
		},

		cancelEdit: function(evt) {
			var view = new PersonView({model: editContact});
			$(evt.target).parents('tr').replaceWith(view.render().el);
		}


	});

	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		idAttribute: "_id", // added this for delete 

		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://192.168.1.100:9090/contacts',
		initialize: function () {

		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var editPersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#edit_mode_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});


})(jQuery, Backbone, _)