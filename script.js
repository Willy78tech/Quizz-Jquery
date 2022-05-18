'use strict';
let profil;
let estSoumis = false;
var marque = 0;
var answer = [];
var count = 0;


$(function () {

    
    $('#quizz').hide();
    $('#start_page').hide();
    $('#dialog').hide();
    $('#myTable').hide();
    $('#accordion').hide();
    $('#info').hide();
    $('.fin').hide();
    

    $("#formulaire").validate(
        {
            rules:{
                fname:{
                    required:true,
                    maxlength: 100,
                    lettersOnly: true
                },
                lname:{
                    required:true,
                    maxlength: 100,
                    lettersOnly: true
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
                    maxlength : "Le nom ne peut pas être plus long que...",
                    lettersOnly: "Lettres autorisées uniquement"
                },
                lname:{
                    required:"Le prénom est obligatoire",
                    maxlength : "Le prénom ne peut pas être plus long que...",
                    lettersOnly: "Lettres autorisées uniquement"
                },
                date:{
                    required:"Le date est requise"
                },
                statut:{
                    required:"Le statut est requis"
                }
            },
            submitHandler: function () {
               $('#start_page').show();
                $('#formulaire').hide();
            }, 
            showErrors: function (errorMap, errorList) {
                if (estSoumis) {
                    const ol = $("<ol></ol>");
                    $.each(errorList, function () {
                    ol.append(`<li>${this.message}</li>`);
                    });
                    $('#afficherErreurs').html(ol)
                    estSoumis = false;
                }
                this.defaultShowErrors();
            },
            invalidHandler: function (form, validator) {
                estSoumis = true;
                
            },
        }
    );
    $.validator.addMethod("lettersOnly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    },
    "Lettres uniquement"
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
        // incrementer la barre de progression bootsrap de 20% à chaque question
        $('.progress-bar').css('width', `${(count+1)*20}%`);
        $('#progression').html(`${(count+1)*20}%`);
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
        // mettre les questions et reponses dans un accordeon 
                $('#accordion').append(`<div class="card">
                <div class="card-header bg-warning" id="heading${i}">
                    <h6 class="mb-0">
                        <button class="btn btn-link btn-block text-left text-decoration-none text-dark font-weight-bold" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        <p>${data.Questions[i].question}</p>
                        </button>
                    </h6>
                </div>
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordion">
                    <div class="card-body">
                    <p class="text-success">${data.Questions[i].answer}</p>
                    </div>
                </div>
            </div>`);
            // mettre les questions et reponses dans un tableau
            $('#myTable').append(`
                <tbody>        
                    <tr>
                        <td class="text-white">${i+1}</td>
                        <td class="text-white">${data.Questions[i].question}</td>
                        <td class="text-white">${data.Questions[i].answer}</td>
                        <td class="text-success text-center w-25 ">&#10003</td>
                    </tr>
                </tbody>
            `);
            }
            else if (answer[i] !== data.Questions[i].answer) {
                // mettre les questions et reponses dans un accordeon
                $('#accordion').append(`<div class="card">
                <div class="card-header bg-warning" id="heading${i}">
                    <h6 class="mb-0">
                        <button class="btn btn-link btn-block text-left text-decoration-none text-dark font-weight-bold" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        <p>${data.Questions[i].question}</p>
                        </button>
                    </h6>
                </div>
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordion">
                    <div class="card-body">
                    <p class="text-danger">${answer[i]}</p>
                    <p class="text-dark">Correction : <span class="text-success">${data.Questions[i].answer}</span></p>
                    </div>
                </div>
            </div>`);
            // mettre les questions et reponses dans un tableau
            $('#myTable').append(`
                <tbody>                    
                    <tr>
                        <td class="text-white">${i+1}</td>
                        <td class="text-white">${data.Questions[i].question}</td>
                        <td class="text-white">${answer[i]}</td>
                        <td class="text-white">${data.Questions[i].answer}</td>
                    </tr>
                </tbody>     
            `);
            }
            
        }
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
            $('#quizz').show();
            $('#start_page').hide(); 
            $('#next').show();
            $('#prev').hide();
            $('#finish').hide();
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

        // Intégration d'un tableau de résultat
        $('#myTable').DataTable();

        // Fin du quizz
        $("#finish").click(function () {
            if (count > answer.length - 1) {
                alert("Vous devez sélectionner au moins 1 réponse");
                $('#finish').show();
            }
            else {
                // afficher les données du formulaire dans la div info
                $('#nom').append(`${localStorage.getItem('nom')}`);
                $('#prenom').append(`${localStorage.getItem('prenom')}`);
                $('#age').append(`${localStorage.getItem('age')}`);
                $('#etat').append(`${localStorage.getItem('statut')}`);

                
                $('#quizz').hide();
                $('#result').show();
                $('#accordion').show();
                $('#dialog').show();
                $('#myTable').show();
                $('#info').show();
                $('.fin').show();
                
                

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
                $( "#accordion" ).accordion();
                $( "#dialog" ).dialog();   
            }
            
        });
    });

});



