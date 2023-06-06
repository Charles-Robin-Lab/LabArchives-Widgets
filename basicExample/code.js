
  //******Unnecssary Extras******//
  my_widget_script = {
    init: function (mode, json_data) {
      //this method is called when the form is being constructed
      // parameters
      // mode = if it equals 'view' than it should not be editable
      //        if it equals 'edit' then it will be used for entry
      //        if it equals 'view_dev' same as view,  does some additional checks that may slow things down in production
      //        if it equals 'edit_dev' same as edit,   does some additional checks that may slow things down in production
  
      // json_data will contain the data to populate the form with, it will be in the form of the data
      // returned from a call to to_json or empty if this is a new form.
      //By default it calls the parent_class's init.
  
      //TO DO write code specific to your form
      this.parent_class.init(mode, json_data);
    },
  
    to_json: function () {
      //should return a json string containing the data entered into the form by the user
      //whatever is return from the method is persisted in LabArchives.  must not be binary data.
      //called when the user hits the save button, when adding or editing an entry
  
      //TO DO write code specific to your form
      return this.parent_class.to_json();
    },
  
    from_json: function (json_data) {
      //populates the form with json_data
      //TO DO write code specific to your form
  
      this.parent_class.from_json(json_data);
    },
  
    test_data: function () {
      //during development this method is called to populate your form while in preview mode
      //TO DO write code specific to your form
      return this.parent_class.test_data();
    },
  
    is_valid: function (b_suppress_message) {
      //called when the user hits the save button, to allow for form validation.
      //returns an array of dom elements that are not valid - default is those elements marked as mandatory
      // that have no data in them.
      //You can modify this method, to highlight bad form elements etc...
      //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
      //Returning an empty array [] or NULL equals no error
      //TO DO write code specific to your form
      return this.parent_class.is_valid(b_suppress_message);
    },
  
    is_edited: function () {
      //should return true if the form has been edited since it was loaded or since reset_edited was called
      return this.parent_class.is_edited();
    },
  
    reset_edited: function () {
      //typically called have a save
      //TO DO write code specific to your form
      return this.parent_class.reset_edited();
    },
  };
//******Actual code******//
$(document).ready(function () {
    // a helper function for some calculations, not necessary for your use
    function repeatString(str, n) {
      if (str.length == 0) {
        return str;
      }
  
      let repeatedString = "";
      while (repeatedString.length < n) {
        repeatedString += str;
      }
      return repeatedString.slice(0, n);
    }
    // When your input changes
    $(".input-change").on("input", function () {
      // TODO:put your code to turn inputs into outputs here
      // get some global input
      var finalLength = $("#final-length").val();
  
      //   do each row of calulations and collect stuff for the final output
      var intermediateValue = "";
      var rows = ["1", "2"];
      $.each(rows, function (index, value) {
        var length = $("#length-" + value).val();
        var str = $("#string-" + value).val();
        var loopedString = repeatString(str, length);
        $("#output-text-" + value).val(loopedString);
        intermediateValue += loopedString;
      });
  
      //   do a final calulation and write it
      $("#final-output-text").val(repeatString(intermediateValue, finalLength));
    });
  });
  
  //This makes outputs look different and not editable
  $(".output-style").css({
    name: "output-field",
    readonly: "readonly",
    "background-color": "#F0E6F0",
    width: "100%",
  });
  $("input").css({
    width: "100%",
  });
  $("td").css({
    width: "100%",
  });
  
  