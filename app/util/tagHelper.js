var tags = {
  'artculture': ["University Events", "Humanities", "Art/Design", "Social Sciences"],
  'athletics': ["Athletics"],
  'lectures': ["Engineering/Technology", "Education", "Business", "Religious/Spiritual", "Law", "Science", "Environment"],
  'movies': ["Movies"],
  'performances': ["Theater & Dance", "Music", "Drama", "Comedy"],
  'workshops': ["Community/Public Service", "Careers", "Isla Vista Community"],
};

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

exports.checkUmbrella = function(tag){

      var umbrellas = [];

      switch(tag){
        case (intersect(tags['artculture'], tag).length != 0):
          umbrella.push('artculture');
        case (intersect(tags['athletics'], tag).length != 0):
          umbrellas.push('athletics');
        case (intersect(tags['lectures'], tag).length != 0):
          umbrellas.push('lectures');
        case (intersect(tags['movies'], tag).length != 0):
          umbrellas.push('movies');
        case (intersect(tags['performances'], tag).length != 0):
          umbrellas.push('performances');
        case (intersect(tags['workshops'], tag).length != 0):
          umbrellas.push('workshops');
        default:
          umbrellas.push('Undefined');
      }
      return umbrellas;
}

exports.arrayForTag = function(tag){
  return tags[tag];
}