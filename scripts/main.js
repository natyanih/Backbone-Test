(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');

			this.listenTo(this.collection, 'add', this.renderView);

			this.collection.fetch();
		},

		renderView: function(model){
			//var item = JSON.stringify(model);

			//alert(item);
			//get values 
			// model.set("num", this.collection.indexOf(model) + 1);

			// var view = new PersonView({model: model});
			// this.contacts_list.append(view.render().el);


			position = this.collection.indexOf(model) + 1;
			model.set("position", position);
			var view = new PersonView({model: model});
			this.contacts_list.append(view.render().el);
		},


		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
			person.set("position", this.collection.length);

			var view = new PersonView({model: person});
			this.contacts_list.append(view.render().el);
		}
	});

	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://localhost/contacts',
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

	var contactApp = new App({collection: new PersonCollection()});


})(jQuery, Backbone, _)