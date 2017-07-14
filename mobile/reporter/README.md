<<<<<<< HEAD
FeedHenry Blank Hybrid App
==========================

A basic 'hello world' Hybrid App.

# Grunt

This template uses [Grunt](http://gruntjs.com/), the Javascript Task Runner. To use Grunt with this Template App, do the following:

* Install grunt: ```npm install -g grunt-cli```
* In your App directory, run: ```npm install```. This installs Grunt plugins, etc for use with this App.
* Run ```grunt serve``` to preview this App locally


### FeedHenry local development

You can also use Grunt to point your App at a local developement server. To do this, use the ```grunt serve:local``` command. Some notes on using the serve:local task:

* by default, the local server development url is: http://localhost:7001
* you can change this directly in your local Gruntfile.js, in the app config:

```
  app: {
    // configurable paths
    app: 'www',
    url: '',
    default_local_server_url: 'http://localhost:7001'
  },
```

* you can also pass a 'url' optional flag to server:local, e.g. ```grunt serve:local --url=http://localhost:9000```

* We can also write your own tasks by extending the Gruntfile.js, e.g. add a 'serve:live' target that hits your server in your FeedHenry live enivronment.
=======
## FeedHenry 3 Studio
### QuickStart Ionic Client-side Template
==================================================================================================================

This repo is basic HTML5/ Ionic Hybrid client side template for projects developed on the FeedHenry 3 Studio.
Visit [FeedHenry](http://www.feedhenry.com) Cloud Platform for more information on developing HTML5 apps with the 
FeedHenry Studio.
>>>>>>> e689b10dad7965d13eba27b50b91994cb35f931d
