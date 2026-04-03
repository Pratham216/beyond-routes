// Source master list (100 entries). This is intentionally stored as raw text
// so the normalizer can convert it into structured Mongo documents.
export const hiddenGemsRaw = `
1KanatalUttarakhandVillageHigh-altitude serenity near Mussoorie. Kaudia forest trekking, ridge walks. Mar–Jun80km from DehradunLowOvershadowed by Mussoorie.
2MunsiyariUttarakhandHamlet"Little Kashmir" with Panchachuli views. Milam Glacier base trek, tribal museum. Mar–Jun600km from DelhiLowLong, grueling drive.
3Tirthan ValleyHPValleyGateway to GHNP; trout paradise. Trout fishing, forest trails. Apr–JunRoad from AutLowNo "mall road" culture.
4Gurez ValleyJ&KValleyBorder paradise near the LOC. Kishanganga river walks, village stays. May–Sep123km from SrinagarVery LowRestricted area, recently opened.
5ShojaHPVillageUnspoiled views near Jalori Pass. Serolsar Lake trek, wooden architecture. Apr–JunCab from AutLowMinimal commercial hotels.
6KalpaHPVillageSacred views of Kinnaur Kailash. Apple orchard walks, Buddhist temples. Apr–Oct230km from ShimlaLowLong travel time.
7ChitkulHPVillageLast village on Tibet border. River camping, meadow treks. May–SepRoad from SanglaLowPerceived as too remote.
8PangotUttarakhandVillageDense forests with 250+ bird species. Birdwatching, nature photography. Oct–Jun15km from NainitalLowNiche focus on birding.
9KomicHPVillageWorld's highest motorable village. Stargazing, monastery visits. Jun–SepRoad from KazaLowExtreme altitude.
10LandourUttarakhandTownColonial-era charm and silence. Bakery visits, walking trails. Year-round5km from MussoorieLowNo vehicle access in town.
11NarkandaHPHillLesser-known skiing and apple belt. Hatu Peak trek, apple picking. Year-round60km from ShimlaLowSeen as a stopover point.
12MukteshwarUttarakhandTown180-degree Himalayan views. Rock climbing, cliffside views. Mar–JunRoad from KathgodamLowPerceived as religious-only.
13Sainj ValleyHPValleyUndiscovered Parvati Valley alternative. Meadow walks, Pundrik Lake trek. Apr–NovCab from AutVery LowNo cafe/party scene.
14BinsarUttarakhandForestZero-signal forest immersion. Zero Point trek, birding. Oct–MarRoad from AlmoraVery LowControlled forest entry.
15ShangarhHPMeadowVast, mystical grasslands. Camping, local deity lore. Mar–JunRoad from SainjLowEmerging on reels.
16JibhiHPVillageRiverside treehouse stays. Waterfall hikes, Mini Thailand. Mar–NovRoad from AutLowDigital nomad favorite.
17NakoHPVillageHigh-altitude sacred lake village. Monastery visits, lake walks. Jun–SepRoad from ShimlaLowBarren, harsh terrain.
18Araku ValleyAPHillTribal culture and coffee estates. Vista Dome train ride, coffee tasting. Sep–MarTrain from VizagLowLong rail travel.
19GandikotaAPCanyon"Grand Canyon of India". Fort exploration, canyon camping. Oct–MarRoad from KadapaLowLack of luxury stays.
20ValparaiTNTea BeltTranquil hills without Ooty's crowds. Tea estate walks, wildlife spotting. Sep–Mar100km from CoimbatoreVery LowPerceived as transit point.
21ChettinadTNHeritageGrand merchant mansions and cuisine. Architecture tours, weaving. Oct–MarRoad from MaduraiLowNiche historical interest.
22DhanushkodiTNGhost TownAbandoned town where two seas meet. Ruined church, Ram Setu views. Oct–Mar20km from RameshwaramModerateGhost town status.
23Varkala (Offbeat)KeralaBeachQuiet coves away from main cliff. Yoga, Black Beach.Nov–Mar50km from TrivandrumModerateMain cliff is crowded.
24Meenmutty FallsKeralaFallsThree-tiered fall in Wayanad. Forest trekking, nature photography. Oct–MayTrek from WayanadLowHard trek requirement.
25AnegundiKarnatakaHeritageMythological twin to Hampi. Coracle rides, cave art visits. Oct–MarFerry from HampiLowPeople stop at Hampi.
26KarwarKarnatakaBeachQuiet alternative to Goa. Kali Bridge, Anshi National Park. Oct–MayRoad from GoaLowMilitary base presence.
27AgumbeKarnatakaForest"Cherrapunji of the South". Waterfall treks, rainforest walks. Oct–MarRoad from UdupiVery LowNiche rainforest focus.
28HonnemarduKarnatakaBackwaterWater sports in forest setting. Kayaking, birdwatching. Oct–MayNear Jog FallsVery LowMinimal accommodation.
29KotagiriTNHillQuieter, wilder version of Ooty. Kodanad Point views, tea walks. Year-round30km from OotyLowLocal preference for silence.
30PollachiTNVillageRustic charm untouched by time. Agri-tours, Annamalai Sanctuary. Oct–Mar40km from CoimbatoreLowLack of "tourist" attractions.
31TheniTNLandscape"Earth's Hidden Paradise". Valley views, spice tours. Oct–MarRoad from MaduraiVery LowPerceived as agricultural.
32PonmudiKeralaHillRolling tea slopes and waterfalls. Peppara Sanctuary treks. Sep–Mar60km from TrivandrumLowFoggy, winding roads.
33NelliyampathyKeralaHillOrange orchards and tea gardens. Camping, tea tasting.Sep–Mar60km from PalakkadLowLimited resort options.
34YanaKarnatakaGeologyDramatic limestone rock formations. Cave temple treks. Oct–MarRoad from SirsiVery LowDifficult forest road.
35AnakkampoyilKeralaNatureCascading streams and forest walks. Stream bathing, homestays. Sep–MarRoad from KozhikodeVery LowHyper-local discovery.
36BekalKeralaBeachPristine beach with giant fort. Fort walks, sunset views. Oct–MarRoad from MangaloreLowRemote North Kerala.
37YelagiriTNHillSmall, peaceful weekend retreat. Nature walks, paragliding. Nov–FebRoad from ChennaiLowPerceived as "mini-hill".
38SirumalaiTNForestDense forests and boating lake. Trekking, boating. Oct–Mar40km from MaduraiLowHigh forest density.
39MararikulamKeralaVillageSleepy fisherman's village. Ayurvedic treatments, beach calm. Oct–Mar11km from AlleppeyLowPerceived as transit point.
40Majuli IslandAssamIslandVanishing river island culture. Satras, mask-making. Oct–MarFerry from JorhatLowEroding landmass.
41Ziro ValleyArunachalValleyApatani culture & rice fields. Music festival, tribal homestays. Mar–NovRoad from ItanagarLowPermit requirements.
42MechukaArunachalValley"Calm spot" with wooden homes. Monastery visits, river walks. Oct–MarLong drive from AlongVery LowExtreme isolation.
43UnakotiTripuraHeritageMassive 7th-century rock carvings. Photography, history walks. Oct–MarRoad from AgartalaVery LowGeographically isolated.
44Dzükou ValleyNagalandValley"Valley of Flowers of the East". Trekking, wildflower spotting. Jun–JulTrek from ViswemaLowDifficult trekking trail.
45DaringbadiOdishaHill"Kashmir of Odisha". Coffee plantations, waterfalls. Nov–FebRoad from BerhampurLowPerceived as local-only.
46NetarhatJharkhandHill"Queen of Chotanagpur". Sunset views, waterfall treks. Oct–MarRoad from RanchiLowLack of national marketing.
47DooarsWBForestFoothills of Eastern Himalayas. Wildlife safaris, tea gardens. Sep–MarRoad from SiliguriLowNiche wildlife focus.
48ChandragiriOdishaSettlement"Mini Tibet of Odisha". Jirang Monastery visits. Oct–MarRoad from BerhampurVery LowHigh niche interest.
49LepchajagatWBVillagePeaceful alternative to Darjeeling. Kanchenjunga views, birding. Oct–Mar19km from DarjeelingLowNo luxury hotels.
50GopalpurOdishaBeachClean, British-esque coastal town. Aqua sports, shell work. Oct–MarRoad from BerhampurLowPort town perception.
51BishnupurWBHeritageTerracotta temple architecture. Temple tours, Baluchari weaving. Oct–Mar132km from KolkataLowNiche architectural focus.
52HaflongAssamHillOnly hill station in Assam. Haflong Lake, orange orchards. Oct–MarRoad from SilcharVery LowSafety misconceptions.
53SualkuchiAssamWeaving"Manchester of Assam". Muga silk weaving tours. Year-roundRoad from GuwahatiLowIndustrial/craft focus.
54Dibang ValleyArunachalValleyRaw Himalayan adventure. 7 Lakes trek, Mishmi tribe. Oct–FebRoad from RoingVery LowPermit/Terrain hurdles.
55MawlyngbnaMeghalayaVillageFossil-rich forest & stone shapes. Grotto exploration, village tales. Sep–MayRoad from ShillongVery LowSustainable focus.
56LongwaNagalandVillageBorder village across two nations. Tribal leader's house visit. Oct–MarRoad from MonLowRemote border location.
57AaloArunachalTownQuiet gateway to far-off valleys. Traditional wooden houses. Oct–MarRoad from AlongVery LowGateway-only status.
58TamenglongManipurForestThick woods and hornbill spotting. Off-trail hiking, birdwatching. Oct–MarRoad from ImphalVery LowOff the tourist route.
59Siju CavesMeghalayaCaveExtensive underground river network. Cave trekking, bat watching. Nov–AprRoad from BaghmaraVery LowPerception of difficulty.
60SandakphuWBPeakViews of 4 tallest world peaks. Himalayan trekking. Oct–DecTrek from ManebhanjanLowHard trekking.
61KalimpongWBTownDarjeeling's quieter twin. Orchid nurseries, Toy Train. Mar–MayRoad from SiliguriLowOvershadowed by Darjeeling.
62SonbhandarBiharCavesInscribed "treasure" caves. Historical exploration, Rajgir. Oct–MarRoad from RajgirLowArchaeological niche.
63BarabarBiharCavesFirst man-made caves in India. Maurya era architecture. Oct–MarRoad from GayaLowUnder-marketed history.
64Kanwar LakeBiharSanctuaryAsia's largest oxbow lake. Migratory birdwatching.Nov–FebRoad from BegusaraiVery LowRamsar site status.
65ValmikiBiharTiger Res.Only tiger reserve in Bihar. Wildlife safaris. Nov–AprRoad from BettiahVery LowSafety misconceptions.
66JawharMaharashtraHill"Mini Mahabaleshwar" (Warli art). Palace visits, Warli workshops. Jun–SepRoad from PalgharLowTribal/Rural perception.
67DiveagarMaharashtraBeachPanoramic beach with palm groves. Beach walks, temple visits. Oct–Mar160km from PuneLowPerceived as local-only.
68WaiMaharashtraTown100+ temples on Krishna river. Temple walks, Sahyadri trekking. Year-round88km from PuneLowPerceived as transit point.
69TarkarliMaharashtraBeachCrystal clear Konkan waters. Scuba diving, kayaking. Oct–MarRoad from MalvanLowOvershadowed by Goa.
70Chorla GhatBorderForestRainforest on Goa border. Waterfall treks, birding. Jun–SepRoad from GoaLowHidden in mountain mist.
71Diu IslandDaman/DiuIslandPortuguese heritage & quiet shores. Fort walks, seafood dining. Nov–FebRoad from RajkotLowCut off from mainland.
72PatanGujaratHeritageHome to Rani Ki Vav stepwell. Stepwell tour, Patola weaving. Oct–MarRoad from AhmedabadLowHeritage focus vs leisure.
73SaputaraGujaratHillOnly forest hill station in state. Lake boating, Gira falls. Year-roundRoad from NashikLowMostly local tourists.
74Velas BeachMaharashtraVillageOlive Ridley Turtle conservation. Turtle festival, beach walks. Feb–AprRoad from PuneLowStrictly seasonal interest.
75MandviGujaratCoastalCenturies-old shipbuilding yard. Shipbuilding tours, beach walks. Oct–MarRoad from BhujLowRemote Kutch location.
76MatheranMaharashtraHillIndia's only car-free hill station. Toy Train ride, forest walks. Year-roundTrain from MumbaiLowNo vehicle access deterrent.
77Nasik (Offbeat)MaharashtraRiver CityTraditional religious atmosphere. River rituals, temple walks. Oct–MarRoad from MumbaiModerateSeen as religious only.
78TrimbakMaharashtraTownSource of the Godavari river. Hill trekking, cave temples. Oct–MarRoad from NashikLowReligious perception.
79Mangi TungiBorderPeaksTwin peaks sacred to Jainism. Dawn pilgrimage, summit treks. Oct–MarRoad from SatanaVery LowRemote pilgrimage spot.
80KonkankadaMaharashtraCliffDizziness-inducing 3000ft cliff. Trekking, panoramic views. Oct–Mar3hr trek requiredVery LowPhysically demanding.
81DholaviraGujaratHeritageIndus Valley Civilization ruins. Archaeological tours, salt flats. Nov–FebRoad from BhujLowPerceived as "just rocks".
82AnjarleMaharashtraVillageReclining Ganesha temple. Temple views, beach walks. Oct–MarRoad from DapoliVery LowHyper-local spot.
83SuvarnadurgMaharashtraFortSea fort accessible by ferry. Marine fort exploration. Oct–MarFerry from HarneLowLack of marketing.
84PatalkotMPValleyDeep gorge with isolated tribes. Tribal village walks, caves. Oct–MarRoad from ChhindwaraVery LowDifficult terrain.
85ChanderiMPHeritageMedieval town famous for silk. Fort tours, weaving workshops. Nov–FebRoad from JhansiLowLack of luxury resorts.
86TamiaMPHillUnexplored hills near Pachmarhi. Viewpoint walks, forest stays. Sep–FebRoad from NagpurVery LowOvershadowed by Pachmarhi.
87MitawaliMPHeritageCircular temple of Chausath Yogini. Architecture walks, photography. Oct–MarRoad from GwaliorVery LowArchaeological niche.
88Orchha (Offbeat)MPHeritageForgotten kingdom on Betwa river.Cenotaph views, river rafting. Oct–MarRoad from JhansiModerateSeen as day-trip only.
89BastarCGCulturalAncient tribal traditions & haats. Chitrakote Falls, tribal crafts.Oct–FebRoad from RaipurVery LowMisconception of safety.
90SirpurCGHeritageAncient archaeological splendor. Temple tours, museum visits. Oct–MarRoad from RaipurLowPerceived as "just ruins".
91Bhander PlateauMPPlateauUnder-discussed high-altitude plain. Rock shelters, farm visits. Oct–MarRoad from nearby townsVery LowMinimal infrastructure.
92Koundinya BeltBorderWildlifeElephant conservation forest. Wildlife spotting, village walks. Oct–MarRoad from ChittoorVery LowNiche conservation focus.
93Raipur (Offbeat)CGCityVibrant markets and old temples. Museum visits, local food. Year-roundAirport/Rail hubModeratePerceived as industrial.
94BilaspurCGNatureDance of nature & royalty. Fort tours, zoological park. Oct–MarRail hubLowLack of national branding.
95DantewadaCGSpiritualDivine trails and scenic tales. Temple visits, mountain views. Oct–MarRoad from BastarVery LowRemote location.
96KankerCGHeritagePalaces, peaks, and pristine falls. Palace stays, waterfall treks. Oct–MarRoad from RaipurVery LowLack of hotels.
97RajimCGSpiritualSerene river banks and echoes. Temple tours, river rituals. Oct–MarRoad from RaipurLowHigh local interest only.
98PadavaliMPHeritageFort with carved temples. Historical walks. Oct–MarRoad from GwaliorVery LowUnder-marketed site.
99BateshwarMPHeritage200 mini sandstone temples. Architecture photography. Oct–MarRoad from GwaliorVery LowRestoration in progress.
100KunoMPWildlifeRe-introduction site of Cheetahs. Wildlife safaris.Oct–MarRoad from GwaliorModerateNiche wildlife news
`;

