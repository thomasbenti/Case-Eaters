import mongoose from "mongoose";
/*
    Post Schema
    - postId: Unique identifier for the post
    - type: Type of post (FreeFood or MealSwipe)
    - title: Title of the post
    - description: Description of the post
    - location: Location details including building code, latitude, and longitude
    - reporter: Reference to the User who created the post
    - createdAt: Timestamp when the post was created
    - expiresAt: Timestamp when the post expires
    - isExpired: Boolean indicating if the post is expired
    - isFlagged: Boolean indicating if the post has been flagged
    - flagCount: Number of times the post has been flagged
*/

// Building codes for locations on and around campus
const BUILDING = Object.freeze({
    "Mather Memorial Building": "MMB",
    "Glennan Gymnasium": "GLY",
    "Adelbert Hall": "ADH",
    "Allen Memorial Library": "AML",
    "Ansel Road Apartments": "ARA",
    "Bolton Field": "BOL",
    "Crawford Hall": "CRH",
    "Duncan House": "DUH",
    "Eaton Hall": "EAT",
    "Fenn Tower": "FEN",
    "Ford Auditorium": "FOR",
    "Gordon Field House": "GFH",
    "Haydn Hall": "HAY",
    "Hershey Hall": "HER",
    "Hitchcock Hall": "HIC",
    "Kelvin Smith Engineering Building": "KSEB",
    "Klinck Commons": "KLC",
    "Linsalata Alumni Center": "LAC",
    "Mandel School of Applied Social Sciences": "MSASS",
    "Mandel JCC": "MJCC",
    "Mather Dance Center": "MDC",
    "Michelson-Morley Hall": "MMH",
    "Milton and Tamar Maltz Performing Arts Center": "MTPAC",
    "Norton Hall": "NOR",
    "Olin Library": "OLI",
    "Prentiss Hall": "PRH",
    "Ritter Library": "RIL",
    "Sears Building": "SEB",
    "Shafran Residence Hall": "SRH",
    "Slavic Village": "SLV",
    "Squire Valleevue Farm": "SVF",
    "Stokes Field": "STF",
    "Thwing Center": "THW",
    "Tinkham Veale University Center": "TVC",
    "Kelvin Smith Library": "KSL",
    "Hathaway Brown School": "HBS",
    "Allen Memorial Medical Library": "AMML",
    "Fribley Commons": "FRC",
    "Guilford House": "GUH",
    "Leutner Commons": "LTC",
    "Nord Hall": "NOD",
    "Richey Mixon Hall": "RMH",
    "Strosacker Hall": "STH",
    "Wolstein Research Building": "WRB",
    "Yost Hall": "YOS",
    "School of Law": "LAW",
    "School of Medicine": "MED",
    "School of Dental Medicine": "DENT",
    "School of Nursing": "NURS",
    "School of Management": "MGT",
    "School of Engineering": "ENG",
    "School of Graduate Studies": "GRAD",
    "Severance Hall": "SEV",
    "Cleveland Museum of Art": "CMA",
    "Cleveland Botanical Garden": "CBG",
    "Cleveland Institute of Music": "CIM",
    "Cleveland Institute of Art": "CIA",
    "Cleveland Cinematheque": "CCM",
    "The Cleveland Orchestra": "TCO",
    "The Cleveland Play House": "CPH",
    "The Cleveland Public Library": "CPL",
    "The Cleveland Museum of Natural History": "CMNH",
    "The Cleveland Metroparks Zoo": "CMZ",
    "The Cleveland Metroparks": "CMP",
});

const BUILDING_COORDS = Object.freeze({
  MMB: { lat: 41.5041, lng: -81.6092 },
  NOD: { lat: 41.5045, lng: -81.6086 },
  THW: { lat: 41.5072, lng: -81.6063 },
  KSL: { lat: 41.5079, lng: -81.6090 },
  //etc
});

const postSchema = new mongoose.Schema({
  postId: { type: Number, unique: true, required: true },
  type: {
    type: String,
    enum: ["FreeFood", "MealSwipe"],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  location: {
    buildingCode: {
      type: String,
      enum: Object.values(BUILDING),
      required: true
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  flagCount: { type: Number, default: 0 },
});

export default mongoose.model("Post", postSchema);