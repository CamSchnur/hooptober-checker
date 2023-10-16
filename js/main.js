const uploadForm = document.getElementById("uploadForm");
const csvList = document.getElementById("csvUpload");
var anyFailures = false;
var anyWarns = false;

uploadForm.addEventListener("submit", function (e){
    e.preventDefault();
    const input = csvList.files[0];
    const reader = new FileReader();
    const outputCheck = function(name, passed, reason="")
    {
        const result = document.createElement("p");
        const reasonOutput = reason ? " (" + reason + ")" : "";
        if(passed == "Pass")
        {
            const node = document.createTextNode(" > " + name + " - Success!" + reasonOutput)
            result.appendChild(node);
            result.className = "success";
        }
        else if(passed == "Fail")
        {
            const node = document.createTextNode(" > " + name + " - Failed!" + reasonOutput);
            result.appendChild(node);
            result.className = "failure";
            anyFailures = true;
        }
        else if(passed == "Warn")
        {
            const node = document.createTextNode(" > " + name + " - Warning!" + reasonOutput);
            result.appendChild(node);
            result.className = "warning";
            anyWarns = true;
        }
        const element = document.getElementById("results");
        element.appendChild(result);
    }
    const validateList = function(movieListParsed)
    {
        //Validate against each individual rule as described here: 
        //https://letterboxd.com/cinemonster/list/hooptober-x-hooptober-hooptober-let-satan/

        //There must be 31 films
        outputCheck("There must be 31 films", (movieListParsed.length >= 31) ? "Pass" : "Fail", movieListParsed.length);
        
        //6 countries
        outputCheck("6 countries",  "Warn", "NOT IMPLEMENTED");

        //8 decades
        const start = 1870; //oldest film on letterboxed is from 1874
        const end = 2020; 
        //make an 2d array with an entry for each decade
        var decades = Array(((end - start) / 10) + 1).fill(Array(start, 0)).map((yearArray, index) => [yearArray[0] + (10 * index), ""]);
        //log the first movie from each decade
        for(var i = 0; i < movieListParsed.length; i++)
        {
            const decadeStartYear = movieListParsed[i]["Year"] - (movieListParsed[i]["Year"] % 10);
            var decadeIndex = decades.findIndex(el => el[0] == decadeStartYear);
            if(decades[decadeIndex][1] == "") 
            {
                decades[decadeIndex][1] = movieListParsed[i]["Title"];
            }             
        }
        //exclude empty decades and then return the list
        var filteredDecades = decades.filter(element => element[1] != "");
        var decadesText = filteredDecades.map(decade => decade[0] + "s: " + decade[1]).join(", ");
        outputCheck("8 decades", (filteredDecades.length >= 8) ? "Pass" : "Fail", decadesText);

        //2 post apocalyptic or natural disaster related films
        outputCheck("2 post apocalyptic or natural disaster related films",   "Warn", "NOT IMPLEMENTED");

        //1 film with Robert Englund
        var englundMovie = "";
        for(var i = 0; i < movieListParsed.length; i++)
        {
            if(checkInclusionInList(movieListParsed[i]["URL"], "robertEnglundMovies") == true)
            {
                console.log(movieListParsed[i]["URL"]);
                englundMovie = movieListParsed[i]["Title"];
                break;
            }
        }
        outputCheck("1 film with Robert Englund",  englundMovie != "" ? "Pass" : "Fail", englundMovie);

        //1 something is underground film
        outputCheck("1 something is underground film",  "Warn", "NOT IMPLEMENTED");

        //3 Satan/Devil centered films
        outputCheck("3 Satan/Devil centered films",  "Warn", "NOT IMPLEMENTED");

        //1 Amicus film.
        outputCheck("1 Amicus film.",  "Warn", "NOT IMPLEMENTED");

        //The worst Dracula film (by Letterboxd rating) that you haven't seen and can access.
        var badDracMovie = "";
        for(var i = 0; i < movieListParsed.length; i++)
        {
            if(checkInclusionInList(movieListParsed[i]["URL"], "badDraculaMovies") == true)
            {
                console.log(movieListParsed[i]["URL"]);
                badDracMovie = movieListParsed[i]["Title"];
                break;
            }
        }
        outputCheck("The worst Dracula film (by Letterboxd rating) that you haven't seen and can access.", badDracMovie != "" ? "Pass" : "Fail", badDracMovie);

        //1 LGBTQ+ connected film
        outputCheck("1 LGBTQ+ connected film",  "Warn", "NOT IMPLEMENTED");

        //5 Films from De Palma, Wes Craven, Ken Russell, Hitchcock and/or Moorhead & Benson.
        outputCheck("5 Films from De Palma, Wes Craven, Ken Russell, Hitchcock and/or Moorhead & Benson.",  "Warn", "NOT IMPLEMENTED");

        //2 Peter Cushing films        
        var cushingMovies = "";
        var cushingMovieCount = 0;
        for(var i = 0; i < movieListParsed.length; i++)
        {
            if(checkInclusionInList(movieListParsed[i]["URL"], "peterCushingMovies") == true)
            {
                console.log(movieListParsed[i]["URL"]);
                if(cushingMovies != "")
                {
                    cushingMovies += ", ";
                }
                cushingMovies += movieListParsed[i]["Title"];
                cushingMovieCount++;
            }
        }
        outputCheck("2 Peter Cushing films",  cushingMovieCount >= 2 ? "Pass" : "Fail", cushingMovies);

        //1 film based on a work of or invoking the name Bram Stoker
        outputCheck("1 film based on a work of or invoking the name Bram Stoker",   "Warn", "NOT IMPLEMENTED");

        //1 film based on a Clive Barker story
        outputCheck("1 film based on a Clive Barker story",   "Warn", "NOT IMPLEMENTED");

        //1 film that was released the year that you turned 10
        outputCheck("1 film that was released the year that you turned 10",  "Warn", "NOT IMPLEMENTED");

        //1 Mario Bava film.
        outputCheck("1 Mario Bava film.",  "Warn", "NOT IMPLEMENTED");

        //1 film with an 'x' in the title 
        outputCheck("1 film with an 'x' in the title ",   "Warn", "NOT IMPLEMENTED");

        //And 1 Tobe Hooper Film (There must ALWAYS be a Hooper film)
        outputCheck("And 1 Tobe Hooper Film (There must ALWAYS be a Hooper film)",   "Warn", "NOT IMPLEMENTED");

        //***FOR THOSE THAT LIKE TO DO EXTRA WORK: WATCH The Zodiac Killer and
        outputCheck("Bonus: The Zodiac Killer",  "Warn", "NOT IMPLEMENTED");

        // 10 Rillington Place. 
        outputCheck("Bonus: 10 Rillington Place",   "Warn", "NOT IMPLEMENTED");

        //Like last year, there is a third film: Shaky Shivers.
        outputCheck("Bonus: Shaky Shivers",   "Warn", "NOT IMPLEMENTED");

        //visually indicate if we have an overall success or failure
        if(anyFailures)
        {
            console.log("fails");
            document.getElementById("results").className = "resultsFail";
            outputCheck("OVERALL ANALYSIS:", "Fail", "Check the above errors.");
        }else if(anyWarns)
        {
            console.log("warns");
            document.getElementById("results").className = "resultsWarn";
            outputCheck("OVERALL ANALYSIS:", "Warn", "Mostly passed but we couldn't determine everything. See the above warnings.");
        }
        else{
            console.log("successes");
            document.getElementById("results").className = "resultsSuccess";
            outputCheck("OVERALL ANALYSIS:", "Pass", "Success! Your list looks good.");
        }
    }
    reader.onload = function(e)
    {   
        const originalText = e.target.result;
        //Add better header to the top of the CSV so d3 can more easily parse it.
        //List items are in a format like:  // 1,Cursed,2005,https://boxd.it/1XiY,"some description"
        const betterFormat = "Number,Title,Year,URL,Description\n" + originalText;
                
        //Parse the data from CSV
        const csvListData = d3.csvParse(betterFormat);

        //Want to ignore several rows here, 
            //row 1 "Letterboxd list export v7",...
            //row 2 "Date", "Name",...
            //row 3 "2022-01-01", 
            //row 4 (blank)
            //row 5 (extra headers)
        //for now, just skip first 5 rows.
        const movieListParsed = csvListData.slice(5);
        
        for(var i = 0; i < movieListParsed.length; i++)
        {
            console.log(movieListParsed[i]);
            //document.write(movieListParsed[i]["Title"] + "<br>");
        }
        validateList(movieListParsed);
    }
    reader.readAsText(input);

});

