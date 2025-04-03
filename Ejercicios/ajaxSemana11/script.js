$(document).ready(function () {
    $("#load-character").click(function () {
        let button = $(this);
        button.prop("disabled", true);

        $.ajax({
            url: "https://api.disneyapi.dev/character",
            method: "GET",
            success: function (response) {
                let characters = response.data; // Accedemos a la lista de personajes

                if (!characters || characters.length === 0) {
                    alert("No characters found.");
                    return;
                }

                // Seleccionamos un personaje aleatorio
                let character = characters[Math.floor(Math.random() * characters.length)];

                console.log("Character Data:", character);

                $("#character-image").attr("src", character.imageUrl);
                $("#name").text(character.name);
                $("#films").text(character.films.length ? character.films.join(", ") : "None");
                $("#tvShows").text(character.tvShows.length ? character.tvShows.join(", ") : "None");
                $("#videoGames").text(character.videoGames.length ? character.videoGames.join(", ") : "None");
                $("#sourceUrl").attr("href", character.sourceUrl).text("More Info");
            },
            error: function () {
                alert("Error fetching character data.");
            },
            complete: function () {
                button.prop("disabled", false);
            }
        });
    });
});
