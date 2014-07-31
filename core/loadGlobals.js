// Global for usage in models and controllers
global.express = require('express');
global.app = express();
global._ = require('underscore');
global.async = require('async');
global.q = require('q');
global.passport = require('passport');
global.LocalStrategy = require('passport-local').Strategy;

