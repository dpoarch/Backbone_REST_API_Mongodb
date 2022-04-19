Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model
let Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
});

// Backbone Collection
let Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/blogs'
});

// Instantiate Collection
let blogs = new Blogs();

// Backbone Views
// Backbone view for one blog
let BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template( $('.blogsListTemplate').html() );
    },
    events: {
        'click .editBlog': 'edit',
        'click .updateBlog': 'update',
        'click .cancelBlog': 'cancel',
        'click .deleteBlog': 'delete'
    },
    edit: function() {
        $(".editBlog").hide();
        $(".deleteBlog").hide();
        this.$(".updateBlog").show();
        this.$(".cancelBlog").show();

        let author = this.$(".author").html();
        let title = this.$(".title").html();
        let url = this.$(".url").html();

        this.$(".author").html("<input type='text' class='form-control authorUpdate' value='" + author + "'>");
        this.$(".title").html("<input type='text' class='form-control titleUpdate' value='" + title + "'>");
        this.$(".url").html("<input type='text' class='form-control urlUpdate' value='" + url + "'>");
    },
    update: function() {
        this.model.set( 'author', $('.authorUpdate').val() );
        this.model.set( 'title', $('.titleUpdate').val() );
        this.model.set( 'url', $('.urlUpdate').val() );

        this.model.save(null, {
            success:function(response) {
                console.log("Successfully UPDATED blog with id: " + response.toJSON()._id );
            },
            error: function() {
                console.log("Failed to UPDATE blog!");
            }
        });

    },
    cancel: function() {
        blogsView.render();
    },
    delete: function() {
        this.model.destroy({
            success: function(response) {
                console.log("Successfully DELETED blog with _id: " + response.toJSON()._id);
            },
            error: function() {
                console.log("Failed to DELETE blog!");
            }
        });
    },
    render: function() {
        this.$el.html( this.template( this.model.toJSON() ));
        return this;
    }
});

// Backbone view for all blogs
let BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogsList'),
    initialize: function() {
        let self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            setTimeout(function() {
                self.render();
            }, 30);
        }, this);
        this.model.on('remove', this.render, this);
        this.model.fetch({
            success: function(response) {
                _.each(response.toJSON(), function(item) {
                    console.log('Successsfully GET blog with id: '+ item._id);
                });
            },
            error: function() {
                console.log("Failed to GET blog!");
            }
        });
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each( this.model.toArray(), function(blog) {
            self.$el.append( (new BlogView( {model: blog} )).render().$el );
        });
        return this;
    }
});

let blogsView = new BlogsView();

$(document).ready(function() {

    $(".addBlog").on("click", function() {

        let blog = new Blog({
            author: $(".authorInput").val(),
            title: $(".titleInput").val(),
            url: $(".urlInput").val()
        });

        $(".authorInput").val("");
        $(".titleInput").val("");
        $(".urlInput").val("");

        blogs.add(blog);

        blog.save(null, {
            success: function(response) {
                console.log("Successfully SAVED blog with _id: "+ response.toJSON()._id);
            },
            error: function() {
                console.log("Failed to SAVED blog!");
            }
        });
    });

});

