'use strict';
let profil;
let estSoumis = false;
var marque = 0;
var answer = [];
var count = 0;




    $("#formulaire").validate(
        {
            rules:{
                fname:{
                    required:true,
                    maxlength: 100,
                    alphanumeric:true
                },
                lname:{
                    required:true,
                    maxlength: 100,
                    alphanumeric:true
                },
                date:{
                    required:true,
                    datePlusPetite: true
                },
                statut:{
                    required: true
                }       
            },
            messages:{
                fname:{
                    required:"Le nom est obligatoire",
                    maxlength : "Le nom ne peut pas être plus long que..."
                },
                lname:{
                    required:"Le prénom est obligatoire",
                    maxlength : "Le prénom ne peut pas être plus long que..."
                },
                date:{
                    required:"Le date est requise"
                },
                statut:{
                    required:"Le statut est requis"
                }
            },
            submitHandler: function () {
                
            }, 
            showErrors: function (errorMap, errorList) {
                if (estSoumis) {
                    const ul = $("<ul></ul>");
                    $.each(errorList, function () {
                    ul.append(`<li>${this.message}</li>`);
                    });
                    $('#afficherErreurs').html(ul)
                    estSoumis = false;
                }
                this.defaultShowErrors();
            },
            invalidHandler: function (form, validator) {
                estSoumis = true;
                
            },
        }
    );

    $.validator.addMethod(
        "datePlusPetite",
        function (value, element) {
        const dateActuelle = new Date();
        return this.optional(element) || dateActuelle >= new Date(value);
        },
        "La date de naissance doit être inférieure à la date d'aujourd'hui"
    );


//.................................... Quizz ..........................................

$(document).ready(function () {

    $('#acceder').click(function(){
        // calcul de l'age avant d'envoyer au localstorage
        const dateNaissance = new Date($('#date').val());
        const dateActuelle = new Date();
        let age = dateActuelle.getFullYear() - dateNaissance.getFullYear();
        const mois = dateActuelle.getMonth() - dateNaissance.getMonth();
        const jour = dateActuelle.getDate() - dateNaissance.getDate();
        if (mois < 0 || (mois === 0 && jour < 0)) {
            age--;
        }

        // enregistrement des données dans le localstorage
        localStorage.setItem('nom', $('#fname').val());
        localStorage.setItem('prenom', $('#lname').val());
        localStorage.setItem('age', age);
        localStorage.setItem('statut', $('#statut').val());
        localStorage.setItem('date', $('#date').val());

        
        /* // envoi de l'age au localstorage
        localStorage.setItem('age', age);
        // sauvegarder les données du formulaire dans le local storage
        localStorage.setItem('fname', $('#fname').val());
        localStorage.setItem('lname', $('#lname').val());
        /* localStorage.setItem('date', $('#date').val());
        localStorage.setItem('statut', $('#statut').val()); */ 
        
    });

    // fonction bouton quizz
    function buttonQuizz(){
        if (count > 0){
            $('#prev').show();
            if(count === 4){
                $('#next').hide();
                $('#finish').show();
            } else {
                $('#next').show();

            }
        } else {
            $('#prev').hide();

        }
    }

    // fonction pour afficher les questions
    function afficherQuestion(data,i){
        $('#question').html(data[i].question);
        $('#options1').html(data[i].option1);
        $('#options2').html(data[i].option2);
        $('#options3').html(data[i].option3);
        $('#options4').html(data[i].option4);
        $('#number').html(Number(i+1));
    }

    // fonction pour afficher les réponses
    function selectedAnswer(){
        for (let i = 0; i < answer.length; i++){
            var a = $('#options').children;
            if(a[i].innerHTML === answer[count]){
                $('#options').children("button")[i].classList.add("active");
            }
            else {
                $('#options').children("button")[i].classList.remove("active");
            }
        }
    }

    // function pour afficher les résultats
    function afficherResultat(data){
        // Bonnes réponses
        for (let i = 0; i < answer.length; i++){
            if (answer[i] === data.Questions[i].answer) {
                marque += 2;
                $('#goodResponse').append(`<p>${data.Questions[i].question}</p>`);
                $('#goodResponse').append(`<p class="text-success">${data.Questions[i].answer}</p>`);
                
            } 
        }
        // Mauvaises réponses avec correction
        for (let i = 0; i < answer.length; i++){
            if (answer[i] !== data.Questions[i].answer) {
                $('#badResponse').append(`<p>${data.Questions[i].question}</p>`);
                $('#badResponse').append(`<p class="text-danger">${answer[i]}</p>`);
                $('#badResponse').append(`<p>Correction : <span class="text-success">${data.Questions[i].answer}</span></p>`);    
            }
        }
        /* $('quizz').hide(); */
        $("#marque").text(marque);
        $("#correct-answer").text(Number(marque) / 2);
        $('#percentage').text((Number(marque) / 10) * 100) + "%";
        $('#result').show();
    }

    // appel à L'API Json

    fetch ('data.json')
    .then(response => response.json())
    .then(data => {
        $('#btn').click(function(){
            $('#options').show();
            afficherQuestion(data.Questions,count);
            /* $('#start_page').hide(); */
            $('#next').show();
            $('#prev').hide();
        });
    

        // Réponse à la question

        $(".option").click(function () {

            $(this).addClass("active");
            $(this).siblings().removeClass("active");
            answer[count] = $(this).html();
        });

        // Question suivante

        $('#next').click(function () {
            if (count > answer.length - 1) {
                alert("Veuillez choisir une réponse");
            }
            else {
                count++;
                afficherQuestion(data.Questions, count);
                $("#prev").show();
                $(".option").removeClass("active");
                buttonQuizz();
                selectedAnswer();
            }
        });

        // Question précédente

        $('#prev').click(function () {
            count--;
            afficherQuestion(data.Questions, count);
            buttonQuizz();
            selectedAnswer();
        });

        // Fin du quizz

        $("#finish").click(function () {
            if (count > answer.length - 1) {
                alert("Vous devez sélectionner au moins 1 réponse");
            }
            else {
                // afficher les données du formulaire dans la div info
                $('#nom').append(`${localStorage.getItem('fname')}`);
                $('#prenom').append(`${localStorage.getItem('lname')}`);
                $('#age').append(`${localStorage.getItem('age')}`);
                $('#etat').append(`${localStorage.getItem('statut')}`);
        
                $('#result').show();
                afficherResultat(data);
                if (marque > 7) {
                    // alerte bootstrap de succès
                    $('#result').append(`<div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">Bravo !</h4>
                    <p>Vous avez réussi le quizz !</p>    
                    </div>`);
                } else if (marque === 6 && marque < 7) {
                    $('#result').append(`<div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Encore un effort !</h4>
                    <p>Vous êtes sur la bonne voie pour réussir le quizz !</p>
                    </div>`);
                } else if (marque < 6) {
                    $('#result').append(`<div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Echec !</h4>
                    <p>Vous n'avez pas réussi le quizz !</p>    
                    </div>`);
                }
            }
        });
    });

});



