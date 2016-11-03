// Créer un formulaire de Création de produit avec les validations suivantes:
//
//    + Titre du produit (uniquement caractères alpha avec tiret minimum 5 caractères)
//    + Code Barre: 11 caractères numérque au format XXXXX XXXXX X
//    + Description: 10 mots avec des caractres alpha numérique avec espace et baslises HTML <b>
//    + Prix: AU format: XX.XX€ avec X un nombre
//    + Disponibilité: date au format dd/mm/YYYY . Verifier que cette date est dans le future avec la fonction Date()
//    + Image: image que de type jpg ou jpeg provenant de Amazon S3. L'image apparait en miniature juste en dessous quand je quitte mon champs
//    + Quantité minimum: nombre < 10000
//    + Quantité maximum: nombre < 10000 et inférieur au maximum
//    + Mot clefs: textarea avec la saisie de mot séparé par des virgule (on mettre un petit compteur de mot a coté)
//    + Couleur: forma text au format hexadecimal #FFEE88 ou rgba(255,255,255,0.8)
//    + Type de vente: liste déroulante avec pour items "Neuf" , "Occasion", "Dematerielisé", "Autre". Quand je selection Autre (change())
//    cela me fait apparaitre un champs en dessous
//    + Boutons "Créer cette fiche produit"
//
//
//    Bonus: Utiliser le plugin Summernote en Jquery pour la description du Produit

(function(){

  $(document).ready(function() {


    $('button#creer').attr("disabled", "disabled");

    // on cahce le champ Autre
    $('input#input-autre').hide();

    // Bootstrap slider
    $("input#input-prix").slider();

    $('input#input-date').datetimepicker({
      format: 'DD/MM/YYYY'
    });

    // Summernote
    $('textarea#input-description').summernote();

    $('input#input-color').ColorPicker({
    	onSubmit: function(hsb, hex, rgb, el) {
    		$(el).val(hex);
        if(regex.hexa.test(hex))
        {
          $('input#input-color').css('color', '#' + $(el).val());
        }
        checkRegex(el, regex.hexa);
    		$(el).ColorPickerHide();

    	},
    	onBeforeShow: function () {
    		$(this).ColorPickerSetColor(this.value);
    	}
    })
    .bind('keyup', function(){
    	$(this).ColorPickerSetColor(this.value);
    });

    // On définie les fonctions de modification du DOM
    function setToRed(input) {
      $(input).parents('.form-group').addClass('has-error');
    }
    function setToNormal(input) {
      $(input).parents('.form-group').removeClass('has-error');
    }
    function addCheck(input) {
      $(input).next().remove();
      $(input).parents('.form-group').addClass('has-feedback');
      $(input).parent().append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
    }
    function removeCheck(input) {
      $(input).next().remove();
      $(input).parents('.form-group').removeClass('has-feedback');
    }

    // On définie les fonctions de verification
    function checkRegex(input, regex) {
      if(regex.test($(input).val()))
      {
        setToNormal(input);
        addCheck(input);
        return true;
      }
      else {
        setToRed(input);
        removeCheck(input);
        return false;
      }

    }

    function checkDesc(input, regex, nbMots) {
      if(regex.test($(input).val()) && $(input).val().split(' ').length >= nbMots)
      {
        setToNormal(input);
      }
      else {
        setToRed(input);
      }
    }

    function checkDate(input, regex) {

      var now = new Date();
      now.setHours(0,0,0,0);

      var dateString = $(input).val();
      var dateParts = dateString.split("/");
      var dateTransf = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

      if(regex.test($(input).val()) && dateTransf > now)
      {
        setToNormal(input);
        addCheck(input);
        return true;
      }
      else {
        setToRed(input);
        removeCheck(input);
        return false;
      }
    }

    // On fait notre objet avec les regex

    var regex = {
      titre: /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ$ \-]{5,}$/,
      codebarre: /^[0-9]{5}\ ?[0-9]{5}\ ?[0-9]{1}$/,
      prix: /^[0-9 ]+(\,|\.)?[0-9]{0,2}€$/,
      date: /(0?[1-9]|[12][0-9]|3[01])[\/\-\:](0?[1-9]|1[012])[\/\-\:]\d{4}/,
      img: /^https?\:\/\/[a-z\.\-\_]*(s3\.amazonaws\.com)[a-zA-Z0-9\.\-\_\/]+(\.jpeg|\.jpg)$/,
      nombre: /^[0-9]+$/,
      desc: /.{5,}/igm,
      heure: /^(((0|1)[0-9])|2[0-3]):[0-5][0-9]$/,
      hexa: /([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/,
    };

    // Les validations au blur

    $('input#input-codebarre').blur(function(){

      checkRegex('input#input-codebarre', regex.codebarre);

    });

    $('input#input-produit').blur(function(){
      checkRegex('input#input-produit', regex.titre);
    });

    // $('input#input-prix').blur(function(){
    //   // var valTmp = $('input#input-prix').val().replace("€", "");
    //   // $('input#input-prix').val(valTmp + "€");
    //   checkRegex('input#input-prix', regex.prix);
    // });

    $("input#input-prix").on("slide", function(slideEvt) {
    	$('input#input-prix').next().text(slideEvt.value + " €");
    });

    $('input#input-date').blur(function(){
      checkDate('input#input-date', regex.date);
    });

    $('input#input-heure').blur(function(){
      checkRegex('input#input-heure', regex.heure);
    });

    $('input#input-img').blur(function(){
      checkRegex('input#input-img', regex.img);
    });

    $('input#input-color').keyup(function(){
      checkRegex('input#input-color', regex.hexa);
    });

    $('input#input-qtmin').blur(function(){
      if(regex.nombre.test($('input#input-qtmin').val()) && parseInt($('input#input-qtmin').val()) < 10000)
      {
        setToNormal('input#input-qtmin');
        addCheck('input#input-qtmin');

      }
      else {
        setToRed('input#input-qtmin');
        removeCheck('input#input-qtmin');
      }
    });

    $('input#input-qtmax').blur(function(){
      if(regex.nombre.test($('input#input-qtmax').val()) && parseInt($('input#input-qtmax').val()) < 10000 && parseInt($('input#input-qtmax').val()) >= parseInt($('input#input-qtmin').val()))
      {
        setToNormal('input#input-qtmax');
        addCheck('input#input-qtmax');

      }
      else {
        setToRed('input#input-qtmax');
        removeCheck('input#input-qtmax');
      }
    });


    // La fonction compteur
    $('textarea#input-motscles').keyup(function(){

      var texte;
      var nbrMots;

      if ($(this).val().match(/[^,]+/g))
      {
        nbrMots = $(this).val().match(/[^,]+/g).length;
      }
      else {
        nbrMots = 0;
      }


      $('textarea#input-motscles').val($('textarea#input-motscles').val().replace(" ", ","));

      if (nbrMots === 0)
      {
        texte = "Aucun mot clé";
        setToRed('textarea#input-motscles');
        removeCheck('textarea#input-motscles');
      }
      else if (nbrMots === 1 ){
        texte = "Un mot clé";
        setToNormal('textarea#input-motscles');
        addCheck('textarea#input-motscles');
      }
      else {
        texte = nbrMots + " mots clés";
        setToNormal('textarea#input-motscles');
        addCheck('textarea#input-motscles');
      }

      $('p.compteur').html(texte);

    });

    // On affiche la vignette
    $('input#input-img').blur(function(){

      if(regex.img.test($('input#input-img').val()))
      {
        $('img.img-thumbnail').remove();
        var html = '<img src="' + $('input#input-img').val() + '" class="img-thumbnail img-thumb">';
        $('input#input-img').parent().append(html);
      }

    });

    // On change le bg du input en fct de la couleur
    $('input#input-color').keyup(function(){

      if(regex.hexa.test($('input#input-color').val()))
      {
        $('input#input-color').css('color', '#' + $('input#input-color').val());
      }

    });

    // On affiche la champ autre
    $('select#input-type').change(function(){

      if ($('#input-type option:selected').val() == "autre")
      {
        $('input#input-autre').fadeIn();
      }
      else {
        setToNormal('#input-type');
        $('input#input-autre').fadeOut();
      }

    });

    // On verifie le champ autre
    $('input#input-autre').keyup(function(){

      if(regex.titre.test($('input#input-autre').val()))
      {
        setToNormal('#input-type');
      }
      else {
        setToRed('#input-type');
      }

    });

    // Les masks
    //  $('input#input-date').mask('00/00/0000');
     $('input#input-heure').mask('00:00');
    //  $('input#input-prix').mask('### ### ### ##0,00€', {reverse: true});
     $('input#input-color').mask('HHHHHH', {'translation': {
                                        H: {pattern: /[\da-fA-F]/}
                                      }
                                });
     $('input#input-codebarre').mask('00000 00000 0', {'translation': {0: {pattern: /[0-9*]/}}});


    // On verifie que tous les check sont ok puis on active le bouton
    $('input,textarea').blur(function(){
     if($('.has-feedback').length == 9)
     {
       $('button#creer').removeAttr("disabled").removeClass('btn-default').addClass('btn-success');
     }
     else {
       $('button#creer').attr("disabled", "disabled").addClass('btn-default').removeClass('btn-success');
     }

    });



    // $('button.btn').click(function(){
    //
    //   // Vérification du titre du produit
    //   checkRegex('input#input-produit', regex.titre);
    //   // Vérification du code barre
    //   checkRegex('input#input-codebarre', regex.codebarre);
    //   // Vérification du prix
    //   checkRegex('input#input-prix', regex.prix);
    //   // Vérification de la description
    //   checkDesc('textarea#input-description', regex.desc, 10);
    //   // Vérification de la date
    //   checkDate('input#input-date', regex.date);
    //   // Verification de l'image
    //   checkRegex('input#input-img', regex.img);
    //
    //   // Vérification des quantités
    //   if(regex.nombre.test($('input#input-qtmin').val()) && parseInt($('input#input-qtmin').val()) < 10000)
    //   {
    //
    //     setToNormal('input#input-qtmin');
    //   }
    //   else {
    //     setToRed('input#input-qtmin');
    //   }
    //
    //   if(regex.nombre.test($('input#input-qtmax').val()) && parseInt($('input#input-qtmax').val()) < 10000)
    //   {
    //     setToNormal('input#input-qtmax');
    //   }
    //   else {
    //     setToRed('input#input-qtmax');
    //   }
    //
    //   // Vérification de la couleur
    //   checkRegex('input#input-color', regex.hexa);
    //
    //   if(regex.titre.test($('input#input-autre').val()) || $('#input-type option:selected').val() != "autre")
    //   {
    //     setToNormal('#input-type');
    //   }
    //   else {
    //     setToRed('#input-type');
    //   }
    //
    //
    // });

  });

})();
