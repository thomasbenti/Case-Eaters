/*
    This file contains the Post model for the database.
    It defines the structure of the Post table and its associations with other tables.

    BUILDING is a JavaScript equivalent to an enum that contains all the buildings on campus.
    It is used to validate the location field in the Post model.
*/
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

module.exports = (sequelize, DataTypes, User) => {
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        location: {
            type: DataTypes.BUILDING,
            allowNull: false,
            validate: {
                isIn: [Object.values(BUILDING)],
            },
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        experationTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reporter: {
            type: User.get('accountId'),
            allowNull: false,
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isFlagged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        flagCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        repOrSwipe: {
            //0 = food report, 1 = meal swipe
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });
    
    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: 'reporter', as: 'user' });
    };
    return Post;
}