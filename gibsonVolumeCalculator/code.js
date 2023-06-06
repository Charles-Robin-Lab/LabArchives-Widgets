

my_widget_script =
{
  init:function (mode, json_data) {
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
    if (mode == 'view') {
       $("#reset-components").hide()
    } else if (mode == 'edit') {
      $("#reset-components").show()
    }     
    this.parent_class.init(mode, json_data);
  },

  to_json:function () {
    //should return a json string containing the data entered into the form by the user
    //whatever is return from the method is persisted in LabArchives.  must not be binary data.
    //called when the user hits the save button, when adding or editing an entry

    //TO DO write code specific to your form
    return this.parent_class.to_json();
    
  },

  from_json:function (json_data) {
    //populates the form with json_data
    //TO DO write code specific to your form

    this.parent_class.from_json(json_data);
  },

  test_data:function () {
    //during development this method is called to populate your form while in preview mode
    //TO DO write code specific to your form
    return this.parent_class.test_data();
  },

  is_valid:function (b_suppress_message) {
    //called when the user hits the save button, to allow for form validation.
    //returns an array of dom elements that are not valid - default is those elements marked as mandatory
    // that have no data in them.
    //You can modify this method, to highlight bad form elements etc...
    //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
    //Returning an empty array [] or NULL equals no error
    //TO DO write code specific to your form
    return this.parent_class.is_valid(b_suppress_message);
  },

  is_edited:function () {
    //should return true if the form has been edited since it was loaded or since reset_edited was called
    return this.parent_class.is_edited();
  },

  reset_edited:function () {
    //typically called have a save
    //TO DO write code specific to your form
    return this.parent_class.reset_edited();
  }
}

$(document).ready(function(){
  $(".input-change2").on('input', function(){
    $("#reagent-volume-10").val(0)
    var fragCount = $("#num-of-frags").val()
    var fpRatio = parseFloat($("#fpratio").val())
    var finalVolume = parseFloat($("#final-volume").val())
    var vectorLength = parseFloat($("#length-1").val())
    var vectorConcentration = parseFloat($("#concentration-1").val())

    var fragments = Array.from({length: fragCount}, (_, i) => (i+2).toString())
    var intermediateSum = 0
    $.each(fragments, function(index, value){
          var length = $("#length-" + value).val()
          var concentration = $("#concentration-" + value).val()
          intermediateSum += length/concentration
    });
    var vectorMass = finalVolume/(1/vectorConcentration+fpRatio*intermediateSum/vectorLength)
    $("#reagent-volume-12").val(parseFloat(vectorMass.toFixed(5)))

    var vectorVolume = vectorMass/vectorConcentration
    $("#reagent-volume-1").val(parseFloat(vectorVolume.toFixed(5)))
    $.each(fragments, function(index, value){
      var length = $("#length-" + value).val()
      var concentration = $("#concentration-" + value).val()
      var volume = length*fpRatio*vectorMass/(vectorLength*concentration)
      $("#reagent-volume-" + value).val(parseFloat(volume.toFixed(5)))
    });
    
    var notFragments = Array.from({length: 8-fragCount}, (_, i) => (fragCount+i+2).toString())
    $.each(notFragments, function(index, value){
      $("#reagent-volume-" + value).val("")
    });
  });
});