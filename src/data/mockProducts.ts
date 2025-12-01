import { Product } from "@/types/product";

// Helper function to parse price strings
const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[$,]/g, ''));
};

// CSV data parsed from Arhaus product catalog
const csvData = `VELLA TALL VASE 2 TONE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Vella_TabletopVase_6003006_White_F-1-3mobile.jpg?v=1725392901,$22.00,$100,25
VELLA BOWL 2 TONE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Vella_TabletopVase_6003005_White_F-1-2tablet.jpg?v=1707860395,$22.00,$100,24
WOODEN PEDESTAL NAT,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/JocelynPedestal-6002272-Natural-12_Lx10_W-P01-tablet-1.jpg?v=1724962923,$55.00,$250,40
WOODEN PEDESTAL EBONY,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$55.00,$250,96
BRYNN WOODEN CARVED TRAY NAT,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/BrynnWoodenCarvedTray-6002271-Natural-20_Lx8_W-P01-tablet.jpg?v=1697835629,$46.20,$210,25
ANDROMEDA BOWL 2 WHT SM,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$28.60,$130,24
ANDROMEDA BOWL 2 BLK SM,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Andromeda_CenterpieceBowl_6003219_White_F-2-2tablet.jpg?v=1721842565,$33.00,$150,9
ANDROMEDA BOWL 1 WHT LG,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/7b0e3c1b-7dc0-45dc-b0c3-8b84fe38e042.png,$35.20,$160,28
ANDROMEDA BOWL 1 BLK LG,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$35.20,$160,17
1 EARTHWARE BWL HANDLE WHITE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Vella_TabletopVase_6002974_White_F-1-2tablet.jpg?v=1707751340,$11.00,$50,29
1 CERAMIC VASE WHITE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Vella_TabletopVase_6002976_White_F-1-2tablet.jpg?v=1707752349,$22.00,$100,6
STONE ON MARBLE BASE NAT,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/KennedyMarbleBaseObjects-6002267-NaturalBrown-OneSize-P01-tablet-1.jpg?v=1697835581,$33.00,$150,92
ORGANIC TRAY BRWN XLG,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Stavros_DecorativeObject_6002927_Brown_ExtraLarge_F-2-2tablet.jpg?v=1721842563,$33.00,$150,31
ORGANIC TRAY BRWN LG,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/bda38be4-4cb1-4687-b941-565e3a3a4e05.jpg,$44.00,$200,44
ORGANIC BOWL BRWN MED,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$22.00,$100,9
ORGANIC BOWL BRWN LG,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Stavros_CenterpieceBowl_6002926_Brown_Large_F-1-2tablet.jpg?v=1721842557,$22.00,$100,45
SCULPTURE 5 WHITE,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$33.00,$150,2
SCULPTURE 5 EBONY,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/59b0080e-7e12-402f-951c-5fd2cee9a72f.jpg,$55.00,$250,12
TOUREG MILK BOWL NAT,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Hannah_CenterpieceBowl_6002269_Natural_Small_F-1-2tablet.jpg?v=1721842557,$77.00,$350,82
TOUREG MILK BOWL EBONY,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Hannah_CenterpieceBowl_6002269_Black_Small_F_CC-1-3mobile.jpg?v=1721842559,$77.00,$350,83
HANNAH TALL BOWL NAT 12,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Hannah_CenterpieceBowl_6003805_Natural_Medium_F-1-2tablet.jpg?v=1721842561,$55.00,$250,68
HANNAH TALL BOWL EBONY 12,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Hannah_CenterpieceBowl_6003805_Black_Medium_F_CC-1-2tablet.jpg?v=1721842559,$55.00,$250,83
FEDIA BOWL 1 TONE BLK,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Fedia_TabletopVase_6003007_Black_F-1-2tablet_e81cde6c-86e4-4122-a849-203bb540f396.jpg?v=1725387399,$19.80,$90,47
RESIN CANISTER BRWN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$15.40,$70,29
DECORATIVE TERRACOTTA BOWL BLK,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/96b73c6f-e654-452c-8d1d-b35f5c41518a.jpg,$46.20,$210,20
EARTHWARE SCULPT HEAVEN GATE L,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Temora_TabletopVase_6002990_Taupe_F-1-2tablet.jpg?v=1707753818,$11.00,$50,40
MAHOGANY ASYMETRICAL BOWL,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/2160dd2b-5011-4159-8d32-47010565cf43.jpg,$70.40,$320,12
COWBELLS NAT,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$22.00,$100,31
PAPER MACHE VASE 2 WHT LG,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/2e575afc-8e3f-48b2-ab71-cc78b12f8ade.jpg,$44.00,$200,8
PAPER MACHE VASE 1 WHT SM,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$41.80,$190,31
CALLIOPE SQ TRAY STRK WHT 24,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$74.80,$340,4
CALLIOPE SQ TRAY BLK 24,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$77.00,$350,1
CALIXTA OVL HNDLE LOW BWL BRWN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Plumosa_TabletopVase_6002983_Taupe_F-1-3mobile.jpg?v=1725386920,$22.00,$100,24
CALIXTA DBL HNDL TLL BRWN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Plumosa_TabletopVase_6003455_Taupe_F-1-3mobile.jpg?v=1725385801,$33.00,$150,14
CALIXTA DBL HNDL POT WHITE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Plumosa_TabletopVase_6002984_White_F-1-3mobile.jpg?v=1725386973,$19.80,$90,1
CALIXTA DANCY VASE BRWN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Plumosa_TabletopVase_6003457_Taupe_F-1-3mobile.jpg?v=1725385766,$11.00,$50,21
BRONWEN POT BRWN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Fedia_TabletopVase_6003007_Brown_F-1-3mobile_ecb71820-fa80-4f8c-82df-06cc31f5d35a.jpg?v=1707419366,$22.00,$100,2
2 EARTHWARE VASE HANDLE BLK,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$4.40,$20,28
2 EARTHWARE TALL HANDLE BLK,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Fedia_TabletopVase_6002978_Black_F-1-3mobile.jpg?v=1725385852,$33.00,$150,56
2 EARTHWARE BWL HANDLES BLK,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$19.80,$90,59
ANTIQUE POT BLK WHT FN45J,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$22.00,$100,35
ANTIQUE POT BLK WHT FN45H,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/BecciaVase-6002535-Black_White-OneSize-P01-tablet.jpg?v=1695852257,$33.00,$150,71
ANTIQUE POT BLK WHT FN45F,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/BecciaVase-6002533-Black_White-OneSize-P01-tablet.jpg?v=1695852251,$33.00,$150,48
ANTIQUE POT BLK WHT FN45E,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/BecciaVase6002532TabletPO1.png?v=1695852245,$33.00,$150,51
ANTIQUE POT BLK WHT FN45D,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/b18be51c.png?v=1695852264,$33.00,$150,28
ANTIQUE POT BLK WHT FN45C,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/292198f5.png?v=1695852272,$33.00,$150,59
ANTIQUE POT BLK WHT FN45B,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/7a2aeb5a.png?v=1695852278,$33.00,$150,51
MAHOGONY TORUS BOWL BRWN 26,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/80b69bd4-2e30-4e7f-bbed-3b37dcdd64f4.jpg,$55.00,$250,83
MAHOGONY TORUS BOWL BRWN 22,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/b9b40da7-cfe2-44a7-9fc2-988bf557e6ae.jpg,$66.00,$300,63
MAHOGONY TORUS BOWL BRWN 14,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/f2ba1fdf-47c4-4bcb-a7bd-31bff2866f27.jpg,$22.00,$100,37
SCULPTURE 4 WHTE,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$33.00,$150,33
SCULPTURE 4 EBONY,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Andro_DecorativeObject_6003209_Black_F-1-2tablet.jpg?v=1721842556,$33.00,$150,9
SCULPTURE 3 WHITE PLASTER,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$35.20,$160,28
SCULPTURE 3 EBONY PLASTER,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$44.00,$200,31
MARBLE STONE OBJECT MED,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$77.88,$354,16
MARBLE STONE OBJECT LG,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/92ed8550-fbce-45a7-9475-253e655844d2.jpg,$63.36,$288,3
BOWL W HNDLES WHTE PLASTER 17,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/AlexiFootedBowl-6002228-White-17_W-P01-tablet-1.jpg?v=1696260389,$33.00,$150,5
BOWL W HNDLES WHT PLAST 30X26,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$77.00,$350,51
BOWL W HNDLES EBONY30X26,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/AlexiOblongWoodBowl-6002226-Black-OneSize-P01-tablet-1.jpg?v=1696260323,$77.00,$350,98
BOWL W HANDLES WHTE PLASTER,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/AlexiTrough-6002230-White-OneSize-P01-tablet.jpg?v=1697835611,$121.00,$550,41
BOWL W HANDLES EBONY 42X17,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/AlexiWoodTrough-6002227-Black-OneSize-P01-tablet-1.jpg?v=1697835620,$132.00,$600,90
BOWL W HANDLES EBONY 17,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/ffd80ce6-73e3-4ed7-be7a-8c7254956027.jpg,$44.00,$200,29
CALISTOGA KG SD RAIL BLK LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$55.00,$250,13
CALISTOGA KG BD SLTS BLACK LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$33.00,$150,14
CALISTOGA CALKG SDRAIL BLK LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$55.00,$250,1
CALISTOGA CAL KG SLTS BLK LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$33.00,$150,1
SEDONA 56 BENCH IN OYSTER,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/0c8481aa-c533-4e77-adeb-a1b47cbdf7bc.jpg,$286.00,"$1,300",17
TAHIRA QUEEN BED HB OYSTER V2,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$121.00,$550,16
TAHIRA KING BED HB OYSTER V2,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/b2de895f-fb3f-466e-9969-9458058c15fb.png,$83.16,$378,20
TAHIRA CAL KG BED HB OYSTER V2,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$83.38,$379,19
ZOE BED V2 QN FB OSTR,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$88.00,$400,16
Tahira Bed,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/06cc3647-2a7b-4c02-8a01-e8fd6332471d.png,$132.00,$600,19
ZOE BED V2 CAL KG FB OSTR,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$65.34,$297,19
Turin Bed FLAX QUEEN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/TurinBed-6002348-SignatureLinen-Cotton-Pewter-P01-tablet.jpg?v=1721241341,$473.00,"$2,150",4
Turin Bed FLAX KING,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/TurinBed-6002348-SignatureLinen-Cotton-Pewter-P01-tablet.jpg?v=1721241341,$528.00,"$2,400",2
Turin Bed,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/16be513b-fbe8-4b7a-bcc0-adb9c90240e5.jpg,$473.00,"$2,150",4
Turin Bed Oyster,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/TurinBed-6002348-SignatureLinen-Cotton-Oyster-P01-tablet.jpg?v=1713890100,$495.00,"$2,250",2
SOFTLINE 6 DRAWER DRESSER BLACK ONE SIZE,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Liana_Dresser_6003052_Black_TQ_1x1_fd95c609-de8d-4890-b381-f1c91e7e0380.png?v=1724185400,$659.78,"$2,999",18
ROUND Bed Footboard Version 3 Oyster QUEEN,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/3244dae5-006f-4030-b95f-96aaab33136c.png,$88.00,$400,13
ROUND Bed Footboard Version 3 Oyster KING,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/0fa4fad4-4fee-47e3-a7a5-02e4a7000de6.png,$110.00,$500,29
RND BCK BED CAL KG FTBRD OYSTR,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$101.42,$461,19
Milano Bed PARCHMENT KING,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/MilanoBed-6002337-PremiumBoucle-Oyster-P01-tablet-1.jpg?v=1712871111,$403.26,"$1,833",23
Milano Bed PARCHMENT CAL KING,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/MilanoBed-6002337-PremiumBoucle-Oyster-P01-tablet-1.jpg?v=1712871111,$660.00,"$3,000",3
Milano Bed,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/e3f59b84-4ff4-49a0-9316-ddc8df50c1a0.jpg,$561.00,"$2,550",7
Milano Bed FLAX CAL KING,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/MilanoBed-6002337-ClassicBoucle-Pewter-P01-tablet-1.jpg?v=1712871111,$561.00,"$2,550",6
Milano Bed BISQUE KING,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/MilanoBed-6002337-PremiumBasketweave-Oyster-P01-tablet.jpg?v=1712871111,$572.00,"$2,600",16
FISH TAIL CHAIR EBONY ONE SIZE,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/13ea7b16-fe25-46ec-bcd4-deec513041fa.jpg,$109.78,$499,2
Chicago Bed,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/Chicago_Bed_6002315_ClassicBoucle_Oyster_TQ-1-3mobile.jpg?v=1722394953,$363.00,"$1,650",4
CALISTOGA BED KING HB BLACK,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$282.04,"$1,282",12
CALISTOGA BED CK HEADBRD BLK,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$289.08,"$1,314",1
5 DRAWER CHEST BLACK ONE SIZE,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/0adb9499-4bbb-41e0-8cdc-6ca2e4c40bfb.jpg,$659.78,"$2,999",38
KEENE QUEEN BED HB BROWN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$204.16,$928,8
KEENE QUEEN BED FB BROWN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$275.00,"$1,250",8
KEENE KING BED HB BROWN LTH,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/50958a9d-edb4-4376-a1ef-c73749f75dac.jpg,$216.92,$986,5
KEENE KING BED FB BROWN LTH,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/7b83bfa4-e643-48c0-977d-f8099668c75e.jpg,$165.88,$754,4
KEENE CAL KG BED HB BROWN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$216.92,$986,1
IDRIS QUEEN BED SD RAIL EBONY,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$64.02,$291,1
IDRIS QUEEN BED HB FB EBONY,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$110.00,$500,1
IDRIS KING BED SD RAIL EBONY,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$110.00,$500,10
IDRIS KING BED HB FB EBONY,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$110.00,$500,10
TUSCANY CAL KG BED HB TAN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$451.00,"$2,050",9
TUSCANY QUEEN BED SLATS IN TAN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$1.98,$9,1
TUSCANY KING BED HB TAN LTH,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/11396f6d-b555-4823-a02a-084fa979ea25.jpg,$295.68,"$1,344",8
TUSCANY KING BD SLTS TAN LTH,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/1daf3926-bb67-448a-92fa-53a184724f9d.jpg,$33.00,$150,7
TUSCANY KG BD SD RAIL TAN LTH,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/94cc4d8d-b504-42c1-9efa-0b80159d4dd7.jpg,$55.00,$250,9
TUSCANY CAL KG SD RAIL TAN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$66.00,$300,13
TUSCANY CAL KG BD SLTS TAN LTH,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$33.00,$150,9
PRIYA QUEEN BED HB IN OYSTER,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$99.00,$450,11
PRIYA KING BED HB OYSTER,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/5416b84e-2dec-44de-a178-524580722968.png,$66.88,$304,28
PRIYA CAL KING BED HB OYSTER,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$128.26,$583,19
LEATHER 54 COUNTER STOOL BROWN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$132.00,$600,11
CALISTOGA 23 COUNTER STOOL BLK,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/94acb184-939d-43d3-9322-81056f8d982f.jpg,$121.00,$550,9
TURIN SLPCVR SD CHR SAND LINEN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$77.00,$350,4
TURIN SLPCVR ARCHR WHITE LINEN,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/170d9d96-d76a-4f71-9e42-8a7fc765ddb9.jpg,$175.78,$799,60
TURIN SLPCVR ARCHR TAUPE LINEN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/ASlipcovered_DiningChair_6002557_ALinen_Taupe_TQ-1-2tablet.jpg?v=1709937523,$129.80,$590,16
TURIN SLPCVR ARCHR STORM LINEN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/ASlipcovered_DiningChair_6002557_ALinen_Storm_TQ-1-2tablet.jpg?v=1709937523,$127.60,$580,33
TURIN SLPCVR ARCHR SAND LINEN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$132.00,$600,24
TURIN SLP SD CHR WHITE LINEN,Arhaus,https://storage.googleapis.com/floorfound-prod-cdn/br_home/products/images/c289efac-96ef-441d-9fd9-0b5aa9a6e43c.jpg,$175.78,$799,30
TURIN SLP SD CHR TAUPE LINEN,Arhaus,https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg,$121.00,$550,30
TURIN SLP SD CHR STORM LINEN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/ASlipcovered_DiningChair_6002558_ALinen_Storm_TQ-1-2tablet.jpg?v=1709937483,$118.80,$540,37`;

// Parse CSV and create products
export const mockProducts: Product[] = csvData
  .trim()
  .split('\n')
  .map((line, index) => {
    const parts = line.split(',');
    if (parts.length < 6) return null;
    
    const name = parts[0];
    const brand = parts[1];
    const imageUrl = parts[2];
    const priceStr = parts[3];
    const msrpStr = parts[4];
    const quantityStr = parts[5];
    
    // Skip if price/MSRP are invalid
    if (!priceStr || !msrpStr || msrpStr === 'N/A') return null;
    
    const price = parsePrice(priceStr);
    const msrp = parsePrice(msrpStr);
    const quantity = parseInt(quantityStr) || 0;
    
    // Skip if price is 0
    if (price === 0 || msrp === 0) return null;
    
    // Calculate discount percentage
    const discountPercentage = Math.round(((msrp - price) / msrp) * 100);
    
    return {
      id: `${index + 1}`,
      name,
      description: `Premium ${name.toLowerCase()} from ${brand}`,
      category: brand,
      originalPrice: msrp,
      discountedPrice: price,
      discountPercentage,
      supplier: {
        id: "s1",
        name: brand,
        rating: 4.8,
        verified: true,
      },
      inStock: quantity > 0,
      imageUrl,
      condition: 'like-new' as const,
      quantity,
      brand,
      sku: `ARH-${(index + 1).toString().padStart(4, '0')}`,
    };
  })
  .filter((product) => product !== null) as Product[];
