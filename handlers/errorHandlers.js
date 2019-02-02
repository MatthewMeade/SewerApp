/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  res.render("404", { title: "Page not found" });
  // next(err);
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/

exports.flashMongoValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash("error", err.errors[key].message));
  req.session.body = req.body;
  res.redirect("back");
};

/*
  Custom Error Handler

  Check for custom error object. Redirects and flashes based on values
*/
exports.flashCustomErrors = (err, req, res, next) => {
  if (!err.error) return next(err);
  req.flash("error", err.error);
  res.redirect(err.redirect);
};
/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, "<mark>$&</mark>")
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    "text/html": () => {
      res.render("error", errorDetails);
    }, // Form Submit, Reload the page
    "application/json": () => res.json(errorDetails) // Ajax call, send JSON back
  });
};

/*
  Production Error Hanlder

  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  req.flash("error", "ERROR: " + err.message);
  res.redirect("/");
};
