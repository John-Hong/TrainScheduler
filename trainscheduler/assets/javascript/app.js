
// -- Initialize Firebase --
var config = {
	apiKey: "AIzaSyB4Txj7oNcemkMksWEXVkgqrgsq1CvMi2s",
	authDomain: "trainjohn-c363a.firebaseapp.com",
	databaseURL: "https://trainjohn-c363a.firebaseio.com",
	storageBucket: "trainjohn-c363a.appspot.com",
	messagingSenderId: "970301445616"
};
firebase.initializeApp(config);



// -- Our Code --
function clearDB() {
	if( confirm("Are you sure you want to delete the entire train schedule? This can not be undone!") )
		firebase.database().ref().remove();
}

var entries = []; // a container for the database entry obj
var col_names = ["train_name", "destination", "frequency", "next_arrival", "minutes_away"]; // const list of different column name in HTML table view

// used to recalculate the time difference, and then update the HTML view of the train schedule
function updateHTML() {
	for( var i = 0; i < entries.length; i++ ) {
		var entry = entries[i];

		var table_data = {
			train_name: entry.train_name,
			destination: entry.destination,
			frequency: entry.frequency,
			next_arrival: null, // this field will be calculated and initialized below
			minutes_away: null  // this field will be calculated and initialized below
		};

		// calculate times
		// TODO ...

		table_data.next_arrival = "12:00"; // e.g. Hard coded
		  
		table_data.minutes_away = "5:00"

		// display values in table_data on the actual HTML
		for( var j = 0; j < col_names.length; j++ ) {
			var col_name = col_names[j];
			var td = $("#train-schedule tr[data-train_name='" + entry.train_name + "'] td[data-col_name='" + col_name + "']");
			td.text( table_data[col_name] );
		}
	}
}

// on document ready
$( function() {

	// setup database listeners
	var database = firebase.database();
	database.ref().on("child_added", function(snapshot) {
		// setup up the new HTML row element for the new database entry
		var tr = $("<tr>");
		for( var i = 0; i < col_names.length; i++ ) {
			var td = $("<td>");
			td.attr( "data-col_name", col_names[i] );
			tr.append(td);
		}
		tr.attr( "data-train_name", snapshot.val().train_name );
		$("#train-schedule tbody").append(tr);

		// add the object holding the database entry to our list of entries
		entries.push( snapshot.val() );

		// update view
		updateHTML();
	});

	// setup HTML listeners
	$("#addTrain-form").on("submit", function(event) {
		event.preventDefault();

		var name = $("#addTrain-form [name='name']").val();
		var dest = $("#addTrain-form [name='dest']").val();
		var initTime = $("#addTrain-form [name='initTime']").val();
		var freq = $("#addTrain-form [name='freq']").val();

		// TODO: validation

		database.ref().push({
			train_name: name,
			destination: dest,
			initial_time: initTime,
			frequency: freq
		});
	});

} );
