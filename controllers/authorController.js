const Author = require("../models/author");

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
exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENETED: Author detail: ${req.params.id}`);
};

//display create form for author, on GET
exports.author_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

//handle for author create POST form
exports.author_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

//display delete form for author, on GET
exports.author_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

//handle for author delete POST form
exports.author_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

//display update form for author, on GET
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

//handle for author update POST form
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
