export type Project = {
    id: number;
    title: string;
    slug: string;
    location: string;
    status: string;
    zone: string;
    bedrooms: number;
    displayPrice: string;
    PlotArea: string;
    address: string;
    description: string;
    image: string;
    images?: string[];
    featured?: boolean;
    unitTypes?: {
        type: string;
        area: string;
        description: string;
    }[];
    amenities?: string[];
    possession?: string;
    totalTowers?: number;
    totalFloors?: number;
    totalUnits?: number;
};

export const projects: Project[] = [
    {
        id: 1,
        title: "Om Heights",
        slug: "om-heights",
        location: "Zundal, Ahmedabad",
        status: "Upcoming",
        zone: "North",
        unitTypes: [
            { type: "2 BHK(TYPE A)", area: "1000 Sq.ft", description: "Thoughtfully designed with optimal space utilization" },
            { type: "2 BHK(TYPE B)", area: "1100 Sq.ft", description: "Spacious 2BHK with modern amenities" },
            { type: "2 BHK(TYPE C)", area: "1200 Sq.ft", description: "Premium 2BHK with extra ventilation" },
            { type: "3 BHK(TYPE D)", area: "1500 Sq.ft", description: "Luxurious 3BHK with master bedroom" },
            { type: "3 BHK(TYPE E)", area: "1600 Sq.ft", description: "Executive 3BHK with premium finishes" }
        ],
        bedrooms: 2 & 3,
        displayPrice: "₹65 Lacs*",
        PlotArea: "3500 Sq.ft",
        address: "120 ft Road, Nr. Sakar Prime, Zundal, Ahmedabad-382421",
        description:
            "PLANNING THAT WINS YOUR HEART. Thoughtfully designed 2 & 3 BHK apartments with zero space wastage planning, ensuring abundant air and light. Live the dream with never before seen amenities arriving in Zundal.",
        image: "/images/project/Om-heights1.png",
        images: [
            "/images/project/Om-heights1.png",
            "/images/project/Om-heights2.png",
            "/images/project/Om-heights3.png",
        ],
        featured: true,
    },

    {
        id: 2,
        title: "THE REGAL ",
        slug: "the-regal",
        location: "Vaishnodevi Circle, SG Highway, Ahmedabad",
        status: "Under Construction",
        zone: "west",
        unitTypes: [
            { type: "4 BHK (Type A)", area: "347 Sq Yards", description: "Spacious 4BHK apartment with large living area and premium layout." },
            { type: "4 BHK (Type B)", area: "335 Sq Yards", description: "Well planned 4BHK with modern architecture and ample natural light." },
            { type: "4 BHK (Type B1)", area: "340 Sq Yards", description: "Elegant 4BHK configuration with spacious rooms and balcony." },
            { type: "4 BHK (Type C)", area: "431 Sq Yards", description: "Luxury 4BHK residence with expansive living spaces and premium finishes." },
            { type: "Penthouse (Type A)", area: "562 Sq Yards + 541 Sq Ft Terrace", description: "Exclusive penthouse with private terrace and panoramic views." },
            { type: "Penthouse (Type B)", area: "555 Sq Yards + 541 Sq Ft Terrace", description: "Luxury penthouse with spacious terrace and elite living experience." }
        ],
        bedrooms: 4,
        displayPrice: "Price On Request",
        PlotArea: "335 – 431 Sq Yards",
        address: "Aristo The Regal, Opp. Infibeam House, Behind Vaishnodevi Mandir, SG Highway, Ahmedabad",
        description: "The Regal Homes is an exclusive 4BHK luxury residential project located at the iconic Vaishnodevi Circle in Ahmedabad. The project offers spacious apartments with personal lift and foyer concept, large balconies, and resort-style amenities. Strategically located near SG Highway and SP Ring Road with easy access to major landmarks and a nearby 15-acre AUDA garden and lake.",
        image: "/images/project/the-regal3.png",
        images: [
            "/images/project/the-regal1.png",
            "/images/project/the-regal2.png",
            "/images/project/the-regal3.png",
        ],
        featured: true,
    },

    {
       
        id: 3, 
        title: "EVARA",
        slug: "evara",
        location: "S.G. Highway, Ahmedabad", 
        status: "Under Construction", 
        zone: "west",
        unitTypes: [
            { type: "3 BHK Cloud-Facing Apartment", area: "Information not specified in brochure", description: "Thoughtfully planned space curated for light, air, and quiet luxury." }, 
            { type: "4 BHK Cloud-Facing Apartment", area: "Information not specified in brochure", description: "Spacious luxury apartments with 600 ft spacing between towers." }, 
            { type: "Penthouses", area: "Information not specified in brochure", description: "Exclusive cloud-facing penthouses offering elevated exclusivity." }
        ],
        bedrooms: 3 ,
        displayPrice: "Price On Request",
        PlotArea: "2,25,000+ Sq. Ft. Total Project Space",
        address: "Evara, Near Vaishnodevi Circle, S.G. Highway, Ahmedabad", 
        description: "EVARA is an iconic masterpiece featuring five majestic residential towers (up to 39 floors) and one exclusive 7-storey club tower. The project offers 3 & 4 BHK cloud-facing apartments and penthouses with over 60% open land. Highlights include a resort-style entrance, 600 ft spacing between 4BHK towers, a temperature-controlled indoor pool, and a rooftop infinity pool.",
        image: "/images/project/evara2.png",
        images: [
            "/images/project/evara1.png",
            "/images/project/evara2.png",
            "/images/project/evara3.png",
        ],
        featured: true,
    },
    {
        id: 4, 
        title: "SIGNET",
        slug: "signet",
        location: "Ahmedabad (Specific locality not explicitly named, but features 5-road corner connectivity)",
        status: "Under Construction", 
        zone: "north-west",
        unitTypes: [
            { type: "3 BHK Residential", area: "Information not specified in brochure", description: "3-side open units designed for maximum fresh air and ventilation." },
            { type: "4 BHK Residential", area: "Information not specified in brochure", description: "Opulent living spaces with expansive, airy, and elegantly designed balconies." }, 
            { type: "Shops", area: "Information not specified in brochure", description: "Commercial spaces integrated within the residential complex." } 
        ],
        bedrooms:4, 
        displayPrice: "Price On Request",
        PlotArea: "5 Road Corner Plot", 
        address: "Signet, Near 18.00 MT. & 20.00 MT. Wide TPS Roads", 
        description: "Signet offers a blend of grandeur and elegance with its 3 & 4 BHK residential units and shops. The project is uniquely situated on a 5-road corner plot, ensuring 3-side open units for every flat. Residents enjoy premium amenities including a 21-foot expansive balcony, a dedicated clubhouse, a wading pool, and various sports facilities like a skating rink and bicycle track for kids.",
        image: "/images/project/signet1.png",
        images: [
            "/images/project/signet1.png",
            "/images/project/signet2.png",
            "/images/project/signet3.png",
        ],
        featured: true,
    },
    {
    id: 5,
    title: "THE Amber",
    slug: "the-amber",
    location: "Nikol - Naroda Area, Ahmedabad",
    status: "Under Construction",
    zone: "east",
    unitTypes: [
        { 
            type: "2 BHK (Type 1)", 
            area: "1215 Sq Ft", 
            description: "Smartly designed 2BHK apartment with spacious living room and dual balcony concept for open views." 
        },
        { 
            type: "2 BHK (Type 2)", 
            area: "1314 Sq Ft", 
            description: "Modern 2BHK layout with optimized space planning and natural ventilation." 
        },
        { 
            type: "2 BHK (Type 3)", 
            area: "1320 Sq Ft", 
            description: "Comfortable 2BHK residence with elegant interiors and functional layout." 
        },
        { 
            type: "2 BHK (Type 4)", 
            area: "1350 Sq Ft", 
            description: "Spacious 2BHK apartment featuring large bedrooms and stylish living area." 
        },
        { 
            type: "2 BHK (Type 5)", 
            area: "1380 Sq Ft", 
            description: "Premium 2BHK configuration with well-planned kitchen and balcony spaces." 
        },
        { 
            type: "2 BHK (Type 6)", 
            area: "1400+ Sq Ft", 
            description: "Luxury 2BHK unit offering maximum usable space and comfortable family living." 
        }
    ],
    bedrooms: 2,
    displayPrice: "Price On Request",
    PlotArea: "1215 - 1400+ Sq Ft",
    address: "The Amber by Dobariya Group, Nikol - Naroda Road, Ahmedabad, Gujarat",
    description: "The Amber by Dobariya Group is a premium residential project offering thoughtfully designed 2BHK apartments with two balconies for endless open views. The project features landscaped gardens, children's play area, gymnasium, indoor games, podium seating, banquet hall, and modern lifestyle amenities. Designed for comfortable urban living, the development combines smart architecture, green spaces, and convenient connectivity to major areas of Ahmedabad.",
    image: "/images/project/amber1.jpeg",
    images: [
        "/images/project/amber1.jpeg",
        "/images/project/amber2.jpeg",
        "/images/project/amber3.jpeg",
    ],
    featured: true
},
{
        id: 6,
        title: "PROPOSED RESIDENCE APARTMENT",
        slug: "proposed-residence-sanjay-bhai",
        location: "Ahmedabad",
        status: "Proposed", 
        zone: "north-west",
        unitTypes: [
            { 
                type: "1 BHK (Type 1)", 
                area: "Living: 12'3\"x10'6\", Master Bedroom: 10'0\"x11'0\"", 
                description: "Compact 1BHK layout featuring a kitchen with wash yard, a master bedroom with a standing balcony and 5'0\" cupboard space, and a single toilet."
            },
            { 
                type: "1 BHK (Type 2)", 
                area: "Living: 12'3\"x12'6\", Master Bedroom: 10'0\"x10'9\"", 
                description: "Enhanced 1BHK configuration offering a larger living room, two toilets (Master and Common), and a dedicated balcony." 
            }
        ],
        bedrooms: 1,
        displayPrice: "Price On Request",
        PlotArea: "30.00 MT. Wide Road access",
        address: "Ahmedabad (Specific locality not explicitly named) ",
        description: "A proposed residential apartment project in Ahmedabad designed by Earth Creation. The development features a mix of commercial shops on the ground floor and 1 BHK residential units on typical floors. Amenities include an open theater, gym, yoga and meditation deck, and outdoor games on the terrace.",
        image: "/images/project/pr1.jpeg",
        images: [
            "/images/project/pr1.jpeg",
            "/images/project/pr2.jpeg",
            "/images/project/pr3.jpeg",
        ],
        featured: true,
 },
 {
        id:7, 
        title: "SADHNA OBSIDIAN",
        slug: "sadhna-obsidian",
        location: "Jagatpur, Gota, Ahmedabad",
        status: "Under Construction", 
        zone: "North-West",
        unitTypes: [
            { 
                type: "4 BHK Residence", 
                area: "Ultra Spacious", 
                description: "Luxury residences designed with refined aesthetics and premium finishes, offering dual views of the lake and lush garden landscapes." 
            },
            { 
                type: "5 BHK Duplex Penthouse", 
                area: "Information not specified in brochure", 
                description: "Exclusive top-tier living space offering elevated luxury and distinction." 
            }
        ],
        bedrooms: 5,
        displayPrice: "Price On Request",
        PlotArea: "G+13 Storey Building ",
        address: "Sadhna Obsidian, Malabar County Road, Jagatpur, Gota, Ahmedabad - 382470 ",
        description: "Sadhna Obsidian is an ultra-spacious residential project in the evolving charm of Jagatpur. Developed by Sadhna Group, this G+13 storey development offers a lifestyle crafted for a select few, featuring balconies with serene lake and garden views. The project emphasizes a rare harmony of water and greenery, providing residents with premium finishes and a bold, sleek architectural vision.",
        image: "/images/project/sadhna1.png",
        images: [
            "/images/project/sadhna1.png",
            "/images/project/sadhna2.png",
            "/images/project/sadhna3.png",
        ],
        featured: true,
        amenities: [
            "Indoor splash pool with deck ",
            "Fitness center ",
            "Zumba & Yoga studio ",
            "Multipurpose court ",
            "Indoor games ",
            "Children play area "
        ]
 },
 {
    id: 8,
    title: "ARISTO AVIRA",
    slug: "aristo-avira",
    location: "Ahmedabad",
    status: "Under Construction",
    zone: "North-West",
    unitTypes: [
        {
            type: "3 BHK Residence",
            area: "273 Sq. Yards",
            description: "Spacious 3 BHK residences featuring a 48 ft long sitting balcony, 2 master bedrooms, and 2 allotted car parking with club class amenities."
        },
        {
            type: "3 BHK Residence",
            area: "276 Sq. Yards",
            description: "Premium designed 3 BHK homes offering modern layouts, luxurious finishes, and large balconies for comfortable family living."
        },
        {
            type: "4 BHK Residence",
            area: "375 Sq. Yards",
            description: "Ultra spacious 4 BHK homes designed for luxury living with premium layouts and high-end amenities."
        },
        {
            type: "4 BHK Residence",
            area: "435 Sq. Yards",
            description: "Large luxury residences offering expansive living spaces, modern architecture, and premium lifestyle amenities."
        }
    ],
    bedrooms: 4,
    displayPrice: "1.95 Cr - 2.27 Cr* All Inclusive",
    PlotArea: "14 Storey Towers",
    address: "Aristo Avira, Ahmedabad",
    description: "Aristo Avira is a premium residential development by Parth Goklani featuring 4 towers with 214 residential units and 57 commercial units (Ground + 1). Located on a 2 road corner plot (100 ft & 60 ft), the project offers spacious homes with modern design, large 48 ft sitting balconies, two master bedrooms, and club class amenities. Possession is scheduled for December 2028.",
    image: "/images/project/aristo-avira3.jpeg",
    images: [
        "/images/project/aristo-avira1.jpeg",
        "/images/project/aristo-avira2.jpeg",
        "/images/project/aristo-avira3.jpeg"
    ],
    featured: true,
    amenities: [
        "48 ft Long Sitting Balcony",
        "2 Allotted Car Parking",
        "2 Master Bedrooms",
        "Club Class Amenities",
        "Premium Residential Towers",
        "Corner Plot (100 ft & 60 ft Road)"
    ]
},
{
        id: 9, 
        title: "LA MER",
        slug: "la-mer",
        location: "Chharodi, SG Road, Ahmedabad",
        status: "Arriving Soon", 
        zone: "north-west",
        unitTypes: [
            { 
                type: "3 BHK Grandeur Living Spaces", 
                area: "Features 48 ft. long balcony", 
                description: "Prestigious living units with two master bedroom suites (16' x 11') and a large personal foyer." 
            },
            { 
                type: "4 BHK Grandeur Living Spaces", 
                area: "Information not specified in brochure", 
                description: "Spacious units featuring double-height living rooms with 20 ft. ceilings and tri-master bedrooms." 
            },
            { 
                type: "Retail Units", 
                area: "Ground + 1 Floor", 
                description: "57 retail units integrated into the development." 
            }
        ],
        bedrooms:  4,
        displayPrice: "Price On Request",
        PlotArea: "22 Storeys (Road Corner Project - 30 Mt. & 18 Mt. Roads)",
        address: "La Mer, Near Chharodi Lake, 300 Mt. from S.G. Highway, Ahmedabad ",
        description: "LA MER by Aristo Lifespaces is a landmark 22-storey residential and retail development located just 300 meters from S.G. Highway. The project introduces 'unfiltered luxury' with features like 48-foot-long balconies, double-height living rooms (20 ft. ceilings), and a tri-master bedroom concept. Designed for maximum ventilation and sunlight, it offers a blend of high-end residential towers and a vibrant retail segment.",
        image: "/images/project/la-mer3.jpeg",
        images: [
            "/images/project/la-mer1.jpeg",
            "/images/project/la-mer2.jpeg",
            "/images/project/la-mer3.jpeg",
        ],
        featured: true,
        amenities: [
            "Swimming Pool & Splash Pool",
            "Gymnasium",
            "Indoor Game Zone",
            "Double-Height Entrance Lobby",
            "Home Theatre / AV Room",
            "Co-working Space & Library",
            "EV Charging Station",
            "Yoga Space & Activity Studio",
            "Toddler's Play Area & Kids Play Zone",
            "Senior Citizen Sitting & Lawn Area"
        ]
 },
{
    id: 10,
    title: "ARISTO Anantam",
    slug: "aristo-anantam",
    location: "Ahmedabad, Gujarat",
    status: "Under Construction",
    zone: "west",
    unitTypes: [
        { 
            type: "3 BHK", 
            area: "277 Sq Yards", 
            description: "Premium 3BHK residence with spacious living area, modern layout, and two balconies for enhanced ventilation." 
        },
        { 
            type: "3 BHK (Large)", 
            area: "280 Sq Yards", 
            description: "Elegant 3BHK configuration featuring expansive rooms, stylish interiors, and comfortable family living." 
        },
        { 
            type: "4 BHK", 
            area: "330 Sq Yards", 
            description: "Luxury 4BHK apartment located on the 1st floor with generous living spaces and premium design." 
        },
        { 
            type: "Skyvilla Type A", 
            area: "387 Sq Yards + 11 Sq Yards Terrace", 
            description: "Exclusive Skyvilla with double height living room, private terrace, and luxurious lifestyle amenities." 
        },
        { 
            type: "Skyvilla Type B", 
            area: "460 Sq Yards + 40 Sq Yards Jacuzzi Area", 
            description: "Ultra luxury Skyvilla featuring private jacuzzi area, expansive terrace, and premium sky-level living experience." 
        }
    ],
    bedrooms: 3,
    displayPrice: "Price On Request",
    PlotArea: "277 - 460 Sq Yards",
    address: "Aristo Anantam, Ahmedabad, Gujarat",
    description: "Aristo Anantam is a premium residential project offering luxurious 3BHK, 4BHK, and Skyvilla residences in Ahmedabad. The project features two towers with 22 storeys and includes 124 residential units along with 18 commercial units on the ground floor. Designed as a two-road corner development (100 ft & 60 ft road), the project offers spacious homes with a 20 ft double height living room, three master bedrooms, and two large balconies. The Skyvillas provide an ultra-premium living experience with private terraces and jacuzzi areas, making Aristo Anantam a perfect blend of luxury, comfort, and modern architecture.",
    image: "/images/project/ARISTO-Anantam1.jpeg",
    images: [
        "/images/project/ARISTO-Anantam1.jpeg",
        "/images/project/ARISTO-Anantam2.jpeg",
        "/images/project/ARISTO-Anantam3.jpeg"
    ],
    featured: true,
    possession: "Mid 2028"
},
{
    id: 11,
    title: "Shantam Parmeshwar",
    slug: "shantam-parmeshwar",
    location: "Vandematram, Gota, Ahmedabad",
    status: "Under Construction",
    zone: "north-west",
    unitTypes: [
        { 
            type: "3 BHK (Type A)", 
            area: "2286 Sq Ft (254 Sq Yards)", 
            description: "Spacious 3BHK residence with modern layout, hanging balcony, and premium living spaces." 
        },
        { 
            type: "3 BHK (Type B)", 
            area: "2268 Sq Ft (252 Sq Yards)", 
            description: "Well-planned 3BHK apartment with large rooms, natural ventilation, and elegant design." 
        }
    ],
    bedrooms: 3,
    displayPrice: "Price On Request",
    PlotArea: "2268 - 2286 Sq Ft",
    address: "Shantam Parmeshwar, Vandematram, Gota, Ahmedabad, Gujarat",
    description: "Shantam Parmeshwar by Dobariya & Co. is a premium residential project located in the fast-growing area of Vandematram, Gota, Ahmedabad. The project features 3 towers with 13 storeys and offers only 152 exclusive residential units. Designed with hanging balconies and a no-vehicle zone on the ground floor, the development ensures a safe and peaceful environment for residents. The project provides some of the largest 3BHK homes in the segment along with modern lifestyle amenities including banquet hall, movie theatre, gymnasium, library, indoor games, landscaped gardens, kids play area, and more.",
    image: "/images/project/Shantam-Parmeshwar1.jpeg",
    images: [
        "/images/project/Shantam-Parmeshwar1.jpeg",
        "/images/project/Shantam-Parmeshwar2.jpeg",
        "/images/project/Shantam-Parmeshwar3.jpeg"
    ],
    featured: true,
    possession: "December 2026",
    totalTowers: 3,
    totalFloors: 13,
    totalUnits: 152
}
];