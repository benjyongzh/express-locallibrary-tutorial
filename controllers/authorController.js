const Author = require("../models/author");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

const async = require("async");

//display list of all authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([["last_name", "ascending"]])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      //success
      res.render("author_list", {
        title: "Author List",
        author_list: list_authors,
      });
    });
};

//display detail page for specific author
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      author_books(callback) {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      //success
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

//display create form for author, on GET
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

//handle for author create POST form
exports.author_create_post = [
  //validate and sanitize field
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  //process request after validation and sanitization
  (req, res, next) => {
    //extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //there are errors. render form again with sanitized values and error messages
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    }

    //date is valid, render author object with escaped and  trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    author.save((err) => {
      if (err) {
        return next(err);
      }

      //success. render author's page
      res.render(author.url);
    });
  },
];

//display delete form for author, on GET
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.author == null) {
        //no results
        res.redirect("/catalog/authors");
      }

      //success
      res.render("author_delete", {
        title: "Delete Author",
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

//handle for author delete POST form
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },

    (err, results) => {
      if (err) {
        return next(err);
      }

      //success
      if (results.authors_books.length > 0) {
        //author has books. render in same way as GET route
        res.render("author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      }

      //author has no books. Delete object and redirect to the list of authors
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) {
          return next(err);
        }

        //success - go to author list
        res.redirect("/catalog/authors");
      });
    }
  );
};

//display update form for author, on GET
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

//handle for author update POST form
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
