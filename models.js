'use strict';

var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var HomeSchema = new Schema({
  carousel: {type: Array, default: ["http://media1.britannica.com/eb-media/19/128619-004-9B4972E1.jpg",
    "https://static.wixstatic.com/media/94b393_34d8d7fa6dc94d19840615aaa1b18d19~mv2.jpg",
    "http://www.ghschildrens.org/myimages/img_0267.jpg"]},
  summary: {type: String, default:"Lomo distillery man bun put a bird on it asymmetrical, hoodie air plant authentic narwhal humblebrag food truck pickled edison bulb. Man bun lyft activated charcoal, vegan 90's sartorial stumptown live-edge DIY. Tousled etsy craft beer lumbersexual tacos, hoodie butcher art party readymade. Vice lumbersexual adaptogen vinyl ethical small batch. VHS chicharrones gluten-free, vinyl man bun yr pop-up lyft normcore master cleanse asymmetrical art party. Jean shorts narwhal live-edge, enamel pin meh synth street art brooklyn typewriter. Lo-fi mixtape banjo, lomo gochujang bicycle rights retro scenester butcher single-origin coffee la croix lumbersexual pour-over kombucha."},
});

var ResearchSchema = new Schema({
  title: {type: String, default: "Title"},
  summary: {type: String, default: "Taxidermy vexillologist echo park, excepteur fashion axe fingerstache etsy est glossier franzen photo booth vape banh mi bushwick palo santo. Fingerstache veniam gluten-free meh keytar austin, next level irure fam. Vape forage fixie, hoodie knausgaard blog 90's neutra normcore cloud bread master cleanse retro craft beer pok pok. Schlitz blog edison bulb mollit bicycle rights mustache asymmetrical green juice 8-bit. Literally pop-up cupidatat craft beer. Readymade you probably haven't heard of them adaptogen kale chips green juice lomo. Gastropub cornhole tumblr, swag irony art party ugh duis blue bottle farm-to-table yr."},
});

var AuthorSchema = new Schema({
  image: {type: String, default: "http://www.belmont.edu/pt/images/headshots/DarrMedium2.jpg"},
  summary: {type: String, default: "Semiotics pinterest DIY beard, cold-pressed kombucha vape meh flexitarian YOLO cronut subway tile gastropub. Trust fund 90's small batch, skateboard cornhole deep v actually before they sold out thundercats XOXO celiac meditation lomo hexagon tofu. Skateboard air plant narwhal, everyday carry waistcoat pop-up pinterest kitsch. Man bun vape banh mi, palo santo kinfolk sustainable selfies pug meditation kale chips organic PBR&B vegan pok pok. Lomo flexitarian viral yr man braid vexillologist. Bushwick williamsburg bicycle rights, sriracha succulents godard single-origin coffee fam activated charcoal."},
  education: {type: String, default: "Venmo 8-bit chambray thundercats. Jianbing drinking vinegar vinyl brunch, blog pop-up flexitarian plaid ramps quinoa food truck pok pok man bun taxidermy. "},
  name: {type: String, default: "Full Name"}
});

var PublicationsSchema = new Schema({
  title: {type: String, default: "Title"},
  description: {type: String, default: "Shoreditch 90's kombucha, VHS godard kitsch lumbersexual sartorial raw denim. Fanny pack freegan yuccie asymmetrical, actually cronut leggings offal iPhone selvage. "},
  authors: {type: Array, default: ["Nancy Darr", "Mary Rose"]},
  link: {type: String, default: "#"},
  date: {type: Date, default: Date.now}
});

var NewsSchema = new Schema({
  createdAt: {type:Date, default:Date.now},
  title: {type:String, default:"Title"},
  description: {type: String, default:"Plaid live-edge yr, meh put a bird on it enamel pin godard cornhole drinking vinegar banh mi flannel pug. Art party fixie lo-fi shabby chic forage. Meh craft beer blog, chicharrones small batch knausgaard flexitarian ugh banh mi. Occupy tattooed franzen, actually unicorn umami synth. Tacos godard kickstarter shaman cred pour-over. Offal pickled trust fund beard letterpress asymmetrical post-ironic jean shorts. Ethical shabby chic vape deep v vice woke af."},
  image: {type: String, default:"http://www.latascausa.com/site/wp-content/uploads/2013/10/Tile-Dark-Grey-Smaller-White-97.png"}
});


var PageSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  home: {type:[HomeSchema], default:[HomeSchema]},
  authors: {type:[AuthorSchema], default:[AuthorSchema, AuthorSchema]},
  research: {type:[ResearchSchema], default:[ResearchSchema]},
  publications: {type:[PublicationsSchema], default:[PublicationsSchema]},
  news: {type:[NewsSchema], default:[NewsSchema]}
});

// hash password before saving to database
PageSchema.pre('save', function(next) {
  var page = this;
  bcrypt.hash(page.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    page.password = hash;
    next();
  })
});

var Page = mongoose.model("Page", PageSchema);
module.exports.Page = Page;
