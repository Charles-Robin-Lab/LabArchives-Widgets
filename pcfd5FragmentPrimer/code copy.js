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
    
    /*-----------
		CSS
	------------*/
    var self = this;
    this.dna = true;
    this.txt = '';
    this.keys = {
      65: 'A',
      71: 'G',
      84: 'T',
      67: 'C',
      85: 'U',
      86: 'V',
      90: 'Z',
      8: 'back',
      17: 'ctrl',
      18:'ctrl',
      91:'opt',
      93:'opt'
      
    }
    $('.sequence-type').css({"margin":"0px 2px 0px 10px"});
    $('.sequence-text').css({"padding":"5px",
                       margin:"10px 0px",
                       width:"585px",
                       "max-width":"585px",
                       "text-transform": "uppercase",
                       "text-align":"center"
                       });
    $(":button").button();
    $('table').addClass('ui-widget');
    $('th,td').css({"padding":"4px"});
    $('th').addClass('ui-widget-header');
    $('td').addClass('ui-widget-content').css({'text-align':'center'});
    $('.bold').css({'font-weight':'bold'});
    $('#crop').addClass('ui-state-disabled');
    $('table').css('float', 'left');
    $('.mol-weight').css({width:'300px',
                          height:'200px',
                          float:'right'});
    $('#percentTotal').css('background-color', 'rgb(100,100,100)');
    
    
    /*------------------
		EVENT LISTENERS
	-------------------*/
    $('.sequence-type').change(function(){
    	var type = $('input[type="radio"]:checked').val();
        self.dna = type=='DNA' ? true : false;
        if($(this).attr('readonly')!='readonly'){
           self.dnaTorna(1);
        }
    });
    
    // TEXTAREA EVENTS
    $('.sequence-text-1').on('input',function () {
      var guideSeq = self.externalToGuideSeq($('#sequence-text-1').val().toUpperCase())

      $('#primer-1').text("GCGGCCCGGGTTCGATTCCCGGCCGATGCA "+guideSeq+" GTTTTAGAGCTAGAAATAGCAAG")
    });
    $('.sequence-text-2').on('input',function () {
      var guideSeq = self.externalToGuideSeq($('#sequence-text-2').val().toUpperCase())

      $('#primer-2').text(self.reverse(self.complement(guideSeq))+" TGCACCAGCCGGGAATCGAACCC")
      $('#primer-3').text(guideSeq+" GTTTTAGAGCTAGAAATAGCAAG")  
    });
    $('.sequence-text-3').on('input',function () {
      var guideSeq = self.externalToGuideSeq($('#sequence-text-3').val().toUpperCase())

      $('#primer-4').text(self.reverse(self.complement(guideSeq))+" TGCACCAGCCGGGAATCGAACCC")
      $('#primer-5').text(guideSeq+" GTTTTAGAGCTAGAAATAGCAAG")     
    });
    $('.sequence-text-4').on('input',function () {
      var guideSeq = self.externalToGuideSeq($('#sequence-text-4').val().toUpperCase())

      $('#primer-6').text("ATTTTAACTTGCTATTTCTAGCTCTAAAAC "+self.reverse(self.complement(guideSeq))+" TGCACCAGCCGGGAATCGAACCC")
      
    });
    
    
    $(document).mousedown(function(e) {
        // The latest element clicked
        self.target = $(e.target);
    }).mouseup(function(e){
      if(self.target.attr('class')=='sequence-text'){
      	//Selected something inside textarea allow cropping.
        self.txt = self.getText(document.activeElement);
        if(self.txt.length>0){
        	$('#crop').removeClass('ui-state-disabled');
        }
      }
    });
    
    this.parent_class.init(mode, json_data);
    
	try{
    seqType =(JSON.parse(json_data)[0].value);
    //seqType = 'DNA';
    
    if(seqType=='DNA'){  
      this.dna = true;
      $('.sequence-type[value="DNA"]').prop("checked",true);
      $('.sequence-type[value="RNA"]').prop("checked",false);
    }
    this.dnaTorna(false);
    }catch(err){
      // loaded first time - no data yet
    	$('.sequence-type[value="DNA"]').prop("checked",true);
        $('.sequence-type[value="RNA"]').prop("checked",false);
        $('textarea').val('');
        $('#mol-weight').val('');
        
    }
  },
  
  /*
	DNATORNA: switch sequence type DNA<->RNA
  */
  dnaTorna:function(complement){
  	// toggle all T->U
    var str = $('textarea').val().toUpperCase();
    var chars = ['A', 'T', 'G', 'C', 'U'];
    var str1 = "";
    for(i=0;i<str.length;i++){
      var char = str[i];
      if(this.dna && char=="U") {char="T"}
      else if(!this.dna && char=="T") {char="U"}
      if(chars.indexOf(char)!=-1){
      	str1 += char;
      }
    }
    // change labels in table
    $('textarea').val(str1);
    if(complement){
	    this.complement();
    }
    
    if(this.dna){
    	// switch to DNA
      $('input#TU').val('T');
      $('.table-name[nuc="U"]').html('T').attr('nuc', 'T');
      $('.table-count[nuc="U"]').attr('nuc', 'T');
      $('.table-percent[nuc="U"]').attr('nuc', 'T');
      $('.prompt').html('Molecular Weight of DNA Sequence');
      $('.note').html("This weight includes 79.0 to take into account the 5' monophosphate left by most restriction enzymes");
      $('.dnaOnly').fadeIn(100);
      this.count(); // update AT and GC counts + molecular weight
    }else{
      // switch to RNA
      $('input#TU').val('U');
      $('.table-name[nuc="T"]').html('U').attr('nuc', 'U');
      $('.table-count[nuc="T"]').attr('nuc', 'U');
      $('.table-percent[nuc="T"]').attr('nuc', 'U');
      $('.dnaOnly').fadeOut(100);
      /*$('#numAT').html('');
      $('#percentAT').html('');
      $('#numGC').html('');
      $('#percentGC').html('');*/
      $('.prompt').html('Molecular Weight of RNA Sequence');
      $('.note').html("This weight includes 159.0 to take into account the M.W. of a 5' triphosphate");
      this.count(); // update molecular weight
    }
    
    
  },
  /**
   * get a guide sequence from CrisprDirect or CHOPCHOP
   */
  externalToGuideSeq:function(s){
    if (s.length <= 20 && s.length > 8) {return s}
      
    if (s.length >= 23) {
      if (s.endsWith("GG")) {
        return s.slice(0, -3);
      } else {
        return s;
      }
    }
    return '[?????????????]'
  },
  /*
	REVERSE sequence
  */
  reverse:function(s){
  	return s.split("").reverse().join("");
  },
  /*
	COMPLEMENT sequence
  */
  complement:function(s){
  	var i;
    var str = s.toUpperCase();
    var out = "";
    for(i=0;i<str.length;i++){
      switch(str[i]){
      	case 'A':
          out+= 'T';
          break;
        case 'T':
        case 'U':
          out+='A';
          break;
        case 'C':
          out+='G';
          break;
        case 'G':
          out+='C';
          break;
      }
    }
    return out;
  },
  
  
  /*
	GETTEXT: get currently selected text (used for cropping)
  */
  getText: function(elem) {
    if(elem.tagName == "TEXTAREA") {
        return elem.value.substring(elem.selectionStart,elem.selectionEnd);
    }
    return null;
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
    //alert(JSON.parse(json_data)[0]);
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
