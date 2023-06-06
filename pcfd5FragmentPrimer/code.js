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
//******Code we care about******//
$(document).ready(function () {
  // helper functions
  /**
   * get a guide sequence from CrisprDirect or CHOPCHOP
   */
  function externalToGuideSeq(s) {
    if (s.length <= 20 && s.length > 8) {return s}
      
    if (s.length >= 23) {
      if (s.endsWith("GG")) {
        return s.slice(0, -3);
      } else {
        return s;
      }
    }
    return '[?????????????]'
  }
  function reverse(s) {
    return s.split("").reverse().join("");
  }
  function complement(s) {
    var i;
    var str = s.toUpperCase();
    var out = "";
    for (i = 0; i < str.length; i++) {
      switch (str[i]) {
        case "A":
          out += "T";
          break;
        case "T":
        case "U":
          out += "A";
          break;
        case "C":
          out += "G";
          break;
        case "G":
          out += "C";
          break;
        default:
          out += [str[i]]
      }
    }
    return out;
  }
  // When your input changes
  $(".input-change").on("input", function () {
    var guideSeq1 = externalToGuideSeq($('#sequence-text-1').val().toUpperCase())
    var guideSeq2 = externalToGuideSeq($('#sequence-text-2').val().toUpperCase())
    var guideSeq3 = externalToGuideSeq($('#sequence-text-3').val().toUpperCase())
    var guideSeq4 = externalToGuideSeq($('#sequence-text-4').val().toUpperCase())
    
    $('#primer-1').val(
      "GCGGCCCGGGTTCGATTCCCGGCCGATGCA " +
      guideSeq1 +
      " GTTTTAGAGCTAGAAATAGCAAG"
    )
    $('#primer-2').val(
      reverse(complement(guideSeq2)) +
      " TGCACCAGCCGGGAATCGAACCC"
    )
    $('#primer-3').val(
      guideSeq2 + 
      " GTTTTAGAGCTAGAAATAGCAAG"
    )
    $('#primer-4').val(
      reverse(complement(guideSeq3)) + 
      " TGCACCAGCCGGGAATCGAACCC"
    )
    $('#primer-5').val(
      guideSeq3 + 
      " GTTTTAGAGCTAGAAATAGCAAG"
    )
    $('#primer-6').val(
      "ATTTTAACTTGCTATTTCTAGCTCTAAAAC " + 
      reverse(complement(guideSeq4)) + 
      " TGCACCAGCCGGGAATCGAACCC"
    )

    $('#fragment-1').val(
      "GCGGCCCGGGTTCGATTCCCGGCCGATGCA " + 
      guideSeq1 +
      " GTTTTAGAGCTAGAAATAGCAAGTTAAAATAAGGCTAGTCCGTTATCAACTTGAAAAAGTGGCACCGAGTCGGTGCTAACAAAGCACCAGTGGTCTAGTGGTAGAATAGTACCCTGCCACGGTACAGACCCGGGTTCGATTCCCGGCTGGTGCA " +
      guideSeq2
    )
    $('#fragment-2').val(
      guideSeq2 +
      " GTTTTAGAGCTAGAAATAGCAAGTTAAAATAAGGCTAGTCCGTTATCAACTTGAAAAAGTGGCACCGAGTCGGTGCTAACAAAGCACCAGTGGTCTAGTGGTAGAATAGTACCCTGCCACGGTACAGACCCGGGTTCGATTCCCGGCTGGTGCA " +
      guideSeq3
    )
    $('#fragment-3').val(
      guideSeq3 +
      " GTTTTAGAGCTAGAAATAGCAAGTTAAAATAAGGCTAGTCCGTTATCAACTTGAAAAAGTGGCACCGAGTCGGTGCTAACAAAGCACCAGTGGTCTAGTGGTAGAATAGTACCCTGCCACGGTACAGACCCGGGTTCGATTCCCGGCTGGTGCA " +
      guideSeq4 +
      " GGGTTCGATTCCCGGCTGGTGCA"
    )
  });
});

//This makes outputs look different and not editable
$(".output-style").css({
  name: "output-field",
  readonly: "readonly",
  "background-color": "#F0E6F0",
});
