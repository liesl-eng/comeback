import { Product } from "@/types/product";

// Helper function to parse price strings
const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[$,]/g, ''));
};

// CSV data from multiple suppliers
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
TURIN SLP SD CHR STORM LINEN,Arhaus,https://cdn.shopify.com/s/files/1/0711/6419/9198/files/ASlipcovered_DiningChair_6002558_ALinen_Storm_TQ-1-2tablet.jpg?v=1709937483,$118.80,$540,37
E26 T30x300 4W 30x300mm LED Light Bulb Clear,Zuo Modern,http://images.salsify.com/image/upload/s--_h9KHzZW--/35e265a5157b7d2e51d30c1f7416c96c2bb44c5a.jpg,$7.06,$30.00,115
E26 G80 6W 110x80mm LED Light Bulb Frosted White,Zuo Modern,http://images.salsify.com/image/upload/s--dOIKCy5d--/aca60fb0b5e04f35835eb36bf9b3246c35938ea4.jpg,$3.46,$15.00,154
E26 ST64 4W 146x64mm LED Light Bulb Clear,Zuo Modern,http://images.salsify.com/image/upload/s--8ZVkF5jh--/959f6e7f0acc207f1d59bbfa7b831224d92781f8.jpg,$3.46,$15.00,47
Wize Table Art Natural,Zuo Modern,http://images.salsify.com/image/upload/s--m5TP0lt0--/a5uj3060hfv9smjlpiwv.jpg,$45.60,$135.00,23
Fan Table Art Gold,Zuo Modern,http://images.salsify.com/image/upload/s--OdHIH7V2--/asgy9nsohxmc6z9mlxel.jpg,$45.60,$150.00,19
Lobo Mirror Natural,Zuo Modern,http://images.salsify.com/image/upload/s--z0xjubDC--/fnf8x22gabnlqqdcnzzn.jpg,$57.60,$210.00,53
Toto Mirror Antique Brown,Zuo Modern,http://images.salsify.com/image/upload/s--YaPdmgeg--/ean4w7rugmwx2qonbnwt.jpg,$57.60,$240.00,51
Kin Mirror Bronze,Zuo Modern,http://images.salsify.com/image/upload/s--h43-CTqF--/h9jir9bi5ikhxrnesx8l.jpg,$69.60,$300.00,35
Tolix Mirror Antique Gold & Black,Zuo Modern,http://images.salsify.com/image/upload/s--MEIrWK58--/zcnjgoijsm9rj6tegpeo.jpg,$81.60,$255.00,6
Saroni Mirror Shelf Antique Gray,Zuo Modern,http://images.salsify.com/image/upload/s--L-VVpNKZ--/a1tdkj2ykuoghz3fwo8u.jpg,$45.60,$150.00,17
Rand Mirror Bronze,Zuo Modern,http://images.salsify.com/image/upload/s--mtWRevzo--/86c0288a92a38da9eb77a1795d60df466ae5120b.jpg,$45.60,$165.00,49
Peralta Mirror Shelf Brass & Brown,Zuo Modern,http://images.salsify.com/image/upload/s--hCrZLOT7--/11545d92ab944ca03c1ad0d82cef3685810bef44.jpg,$57.60,$270.00,20
Dimond Mirror Gold,Zuo Modern,http://images.salsify.com/image/upload/s--fWTy_qi6--/52a045afff4837a481a4e73e7c7d501d4a1fa36f.jpg,$57.60,$285.00,93
Capell Mirror Antique Gray,Zuo Modern,http://images.salsify.com/image/upload/s--B-2-M0oR--/f2a77bfeb2e2e15b4f97391b5c91f214ebd91059.jpg,$69.60,$225.00,38
Bernis Mirror Brass,Zuo Modern,http://images.salsify.com/image/upload/s--9BnSyFxy--/zfyuzmi00gvar6fyd2c6.jpg,$33.60,$120.00,33
Comet Round Mirror Black & Gold,Zuo Modern,http://images.salsify.com/image/upload/s--GGi3fIRk--/cca61c6fbd44ea75bac9c5c354f87f703d33cdf2.jpg,$45.60,$165.00,26
Glow Round Mirror Gold,Zuo Modern,http://images.salsify.com/image/upload/s--K_Moh_ng--/34b31e1f959b6013bc06a6d8592ef69d6cf3706c.jpg,$105.60,$420.00,9
Luna Round Mirror Black,Zuo Modern,http://images.salsify.com/image/upload/s--AFmnD3wO--/dfceab1d55668dc4a130d8f041d600443ff9949b.jpg,$57.60,$240.00,78
ASHCROFT QUEEN BED,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/4c13faa2-69c6-453d-89a0-b5e26d1ce31a.jpg,$523.08,"$1,453.00",1
ASHCROFT KING BED,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/26f888fb-749f-4734-a38c-0007183cce05.jpg,$583.20,"$3,650.00",16
TERRA CORNER CHAIR PERFORMANCE FABRIC NOCTURNAL SKY,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/95a61324-fe4f-4f87-87ab-139b46b998d9.jpg,$248.40,"$1,550.00",5
CLAY SLIPPER CHAIR NUBUCK LEATHER BLACK,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/4a4f8344-db33-4f79-9a6a-b713e39760db.jpg,$483.12,"$2,550.00",7
CLAY CORNER CHAIR PERFORMANCE FABRIC NOCTURNAL SKY,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/da273501-0468-4191-8f83-7b3a31df99a1.jpg,$286.20,"$1,799.00",1
NAPOLI LEATHER BARSTOOL BLACK,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/857169dd-c4c4-4601-8f87-b20b1900f832.jpg,$129.60,$815.00,1
MONTEGO QUEEN BED,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/9b403525-ac8f-41a1-9ba5-f4d2624a5e11.jpg,$385.56,"$1,071.00",1
FORM OTTOMAN VANTAGE BLACK LEATHER,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/687096fc-c7e0-457f-b0d4-626b061e266d.jpg,$181.80,$939.00,5
FORM SLIPPER CHAIR VANTAGE BLACK LEATHER,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/fa16a6e0-d758-41a9-93f7-2ffc8efec778.jpg,$277.56,"$1,449.00",31
FORM CORNER CHAIR VANTAGE BLACK LEATHER,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/afb13668-cb77-496d-a867-ace019cecfac.jpg,$333.72,"$1,699.00",14
ROMY OTTOMAN FOREST SHADE,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/40a8dd73-52bf-4a49-8d9b-2ca44ba8ff76.jpg,$155.52,$969.00,1
EVANDER DINING STOOL,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/f8616a12-77a2-4c66-9b4b-04b329e1c6d6.jpg,$192.96,$999.00,30
EVANDER DINING STOOL RUSTIC BROWN,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/44e2775f-72d5-4cc1-92c7-6f258a30ca06.jpg,$192.96,$999.00,19
AUGUST COUNTER TABLE SMALL,Moe's Home Collection,https://storage.googleapis.com/floorfound-prod-cdn/moes/products/images/1dd64b13-1e62-4d6f-b2b4-3f9a1eeeda8f.jpg,$383.76,"$2,450.00",5
Yosemite King-size Upholstered Footboard Storage Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/5c5e53976ef54484c6b186d3ad9766f67e8c7a77/Modus_Furniture_Yosemite_Upholstered_Footboard_Storage_Bed_in_Cafe_655450150616_7YC9S__Image_1.jpg",$499.00,"$4,119",3
Yosemite California King-size Upholstered Footboard Storage Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/5c5e53976ef54484c6b186d3ad9766f67e8c7a77/Modus_Furniture_Yosemite_Upholstered_Footboard_Storage_Bed_in_Cafe_655450150616_7YC9S_Image01.jpg",$499.00,"$4,129",7
Yosemite King-size Upholstered Panel Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/9b2767e69994a17cbeedb1d3798a332941b67080/Modus_Furniture_Yosemite_Upholstered_Wood_Panel_Bed_in_Cafe_655450126277_7YC9P__Image_1.jpg",$349.00,"$3,049",3
Yosemite Queen-size Upholstered Footboard Storage Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/5c5e53976ef54484c6b186d3ad9766f67e8c7a77/Modus_Furniture_Yosemite_Upholstered_Footboard_Storage_Bed_in_Cafe_655450150616_7YC9S__Image_1.jpg",$449.00,"$3,239",4
Yosemite California King-size Upholstered Panel Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/9b2767e69994a17cbeedb1d3798a332941b67080/Modus_Furniture_Yosemite_Upholstered_Wood_Panel_Bed_in_Cafe_655450126277_7YC9P__Image_1.jpg",$349.00,"$3,049",5
Yosemite Queen-size Upholstered Panel Bed in Cafe,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/9b2767e69994a17cbeedb1d3798a332941b67080/Modus_Furniture_Yosemite_Upholstered_Wood_Panel_Bed_in_Cafe_655450126277_7YC9P__Image_1.jpg",$299.00,"$2,109",4
Townsend Solid Wood Console Table in Java,Modus Furniture,"https://images.salsify.com/images/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/3477c077a605fc663a9806bcc63a3dcef803fb73/Modus_Furniture_Townsend_Solid_Wood_Console_Table_in_Java_655450170898_8T0623_Image01.jpg",$199.00,"$1,869",15
William King-Size Panel Bed in Dusty Dawn,Modus Furniture,"https://images.salsify.com/images/h_9999,w_9999,c_limit/e_trim/cs_srgb,h_2048,w_2048,c_limit/dn_72/q_auto/d6908631031068be3d8850b865d861581943bcde/Modus_Furniture_William_Solid_Wood_Panel_Bed_in_Dusty_Dawn_655450333446_FYBVA__Image_1.jpg",$99.00,"$3,049",27
Takota Dark Brown Rectangular Oak Wood w/ Birch Wood Legs Extendable Dining Table,Mercana,https://marketplace.mercana.com/images/0089005_70890-AB_A.jpeg,"$1,440.00","$3,899",8
Soma Textured Black Acacia Wood Round Dining Table,Mercana,https://marketplace.mercana.com/images/0094259_70883-AB_A.jpeg,$408.00,"$1,209",6
Tucson Natural Wood w/ Round Black Oak Top Side Table,Mercana,https://marketplace.mercana.com/images/0089706_70889-AB_A.jpeg,$243.00,$549,6
Valence 3 Piece (W/ 2 x Ottoman) Castlerock Gray Modular Sofa Set,Mercana,https://marketplace.mercana.com/images/0060958_70054-E_A.jpeg,$600.00,"$1,999",2
Rialto Rectangular Two-Tone Black and Brown Solid Wood Dining Table,Mercana,https://marketplace.mercana.com/images/0087664_70558-AB_A.jpeg,$870.00,"$3,199",6
Tanner Marble & Gold Metal Bistro Table,Mercana,https://marketplace.mercana.com/images/0061006_69938-AB_A.jpeg,$406.80,"$1,509",18
Tanner Marble & Matte Black Bistro Table,Mercana,https://marketplace.mercana.com/images/0065557_69912-AB_A.jpeg,$381.00,"$1,449",15
Athens 48.0L x 28.0W x 16.0H Light Brown Wood and White Marble Coffee Table,Mercana,https://marketplace.mercana.com/images/0079687_69911-AB_A.jpeg,$388.08,"$1,149",2
Svend 111.4L x 68.0W x 33.9H Tan Leather Left Chaise Sectional Sofa,Mercana,https://marketplace.mercana.com/images/0056375_69692-AB_A.jpeg,"$3,044.88","$7,899",6
"D'Arcy 111""L x 70""D x 33""H Tan Leather Right Chaise Sectional",Mercana,https://marketplace.mercana.com/images/0055449_69646-AB_A.jpeg,"$2,850.00","$7,599",13
Felicity 36.0L x 36.0W x 16.0H Marble Top W/Iron Frame Coffee Table,Mercana,https://marketplace.mercana.com/images/0048740_69253-AB_A.jpeg,$408.00,"$1,389",22
Lorlei 20.0L x 20.0W x 23.8H White Marble Top W/Antique Gold Iron Legs End and Side Table,Mercana,https://marketplace.mercana.com/images/0048737_69247-AB_A.jpeg,$258.48,$849,14
"Jacinta 36"" Round Glass Top Metal and Marble Pedestal Coffee Table",Mercana,https://marketplace.mercana.com/images/0035437_69052-AB_A.jpeg,$431.28,"$1,399",14
Shale III 50L x 20W Black Live-Edge Slate and Iron Console Table,Mercana,https://marketplace.mercana.com/images/0035435_69050-AB_A.jpeg,$366.48,"$1,169",3
"Tanner II 48"" Round White Marble Top Black Metal Base Dining Table",Mercana,https://marketplace.mercana.com/images/0035447_68849-AB_A.jpeg,$435.00,"$1,349",19
Tanner I 71L x 35W Rectangular White Marble W/ Metal Base Dining Table,Mercana,https://marketplace.mercana.com/images/0047850_68848-AB_A.jpeg,$575.28,"$1,769",8
"Nathan 36""x36"" Square White Marble Top Black Metal Base Coffee Table",Mercana,https://marketplace.mercana.com/images/0035426_68842-AB_A.jpeg,$345.00,"$1,069",2
"Zyler Marble Side Table, Gold Base",Inspired Home,http://images.salsify.com/image/upload/s--G3Y3ZVcm--/awiwxgzgvjvqwimtqhxg.jpg,$32.58,$181,1
"Zyler Marble Side Table, Black Base",Inspired Home,http://images.salsify.com/image/upload/s--KQdmDTM2--/zxzomvyrwaycebrhv412.jpg,$27.54,$153,1
"Monette Faux Linen Modular Armless Seat Sofa, Pink",Inspired Home,http://images.salsify.com/image/upload/s--JjqN5cQ9--/qcrtzrw10bcaqzhwmq4z.jpg,$90.18,$501,1
"Monette Faux Linen Modular Armless Seat Sofa, Navy",Inspired Home,http://images.salsify.com/image/upload/s--sHvBqAck--/f9u97j2c5txstl781p9s.jpg,$90.18,$501,3
"Monette Faux Linen Modular Left Arm Seat Sofa, Navy",Inspired Home,http://images.salsify.com/image/upload/s--lQBTXT7k--/augct4yvjfseu5hgibwz.jpg,$94.50,$525,2
"Willington 3 Seat Button Tufted Velvet Sofa with Casters, Teal",Inspired Home,http://images.salsify.com/image/upload/s--iRLvicO3--/lfbv1byna74ymdttedhd.jpg,$153.18,$851,1
"Monette Faux Linen Modular Ottoman, Navy",Inspired Home,http://images.salsify.com/image/upload/s--_hkcZbat--/na59hh11uyjpeffhdwpz.jpg,$75.42,$419,1
"Ella Velvet Cube Storage Ottoman w/ Knob Chrome Nailhead Trim, Blush",Inspired Home,http://images.salsify.com/image/upload/s--OzB78GUp--/w7vr4rdisr9imomsdjgn.jpg,$14.40,$80,1
"Giovanni Velvet Left Facing Chaise Sectional w/ Storage, Hunter Green",Inspired Home,http://images.salsify.com/image/upload/s--et84JGbR--/yd7x5m1tgj0jqxfoahza.jpg,$288.54,"$1,603",2
"Daryl 4 door Sideboard with Gold Handle and Metal Frame in High Gloss Lacquer Finish, White",Inspired Home,http://images.salsify.com/image/upload/s--M-HwoH1J--/coptlfckjmg2oobnhqhb.jpg,$145.62,$809,1
"Daryl 4 door Sideboard with Chrome Handle and Metal Frame in Veneer Finish, Ash Grey",Inspired Home,http://images.salsify.com/image/upload/s--Em6WHY7r--/civdj5rw0rrwzall3j1n.jpg,$130.86,$727,1
"Belen 3 Door Sideboard with Gold Handle and Leg Tip, White",Inspired Home,http://images.salsify.com/image/upload/s--IfJh1dH7--/e9hg9hajtyckpt2szhcr.jpg,$121.32,$674,1
"Belen 4 Door Sideboard with Gold Handle and Leg Tip, White",Inspired Home,http://images.salsify.com/image/upload/s--CxeM-FlG--/vhmkk2afp1hkngvjhuk3.jpg,$129.60,$720,1
"Belen 3 Door Sideboard with Gold Handle and Leg Tip, Navy",Inspired Home,http://images.salsify.com/image/upload/s--9GQSxMJs--/caujg9ho0n2lwviwtgyk.jpg,$114.48,$636,3
"Belen 4 Door Sideboard with Gold Handle and Leg Tip, Black",Inspired Home,http://images.salsify.com/image/upload/s--0GzmwQZQ--/v6kikz6yyubvwhf5rshn.jpg,$152.64,$848,1
"Belen 2 Door Sideboard with Gold Handle and Leg Tip, Black",Inspired Home,http://images.salsify.com/image/upload/s--jIYfG9kj--/zfqsuztrl1fdeugt9nfs.jpg,$90.72,$504,1
NutriBullet 1200W Ultra Personal Blender,NutriBullet,https://assets.wsimgs.com/wsimgs/ab/images/dp/wcm/202537/0028/img27xl.jpg,$22.00,$109.99,"8,370"
NutriBullet 600W  Personal Blender,NutriBullet,https://media.kohlsimg.com/is/image/kohls/1098808_Gray?wid=1500&hei=1500&op_sharpen=1,$12.87,$64.37,"2,715"
NutriBullet 900W Pro Personal Blender Matte White,NutriBullet,https://cb.scene7.com/is/image/Crate/NutribulletProMtWhtSSF25_VND?$web_pdp_main_carousel_high$,$20.93,$104.65,"2,523"
NutriBullet 900W Pro Black  Personal Blender,NutriBullet,https://i5.walmartimages.com/seo/Nutribullet-Pro-32-oz-900-Watt-Personal-Blender-Matte-Black-NB9-0901AK_0aa47484-8b12-4bc1-96b3-a1da2c0cbb5a.378b4202b152138c02c853eb5065f5bf.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF,$14.60,$73.00,983
NutriBullet Juicer Machine 800W,NutriBullet,https://slimages.macysassets.com/is/image/MCY/products/9/optimized/18109569_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&fmt=webp,$22.00,$110.00,799
Restore 1,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_1_charcoal.jpg,$20.00,$99.99,2049
Restore 1,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_1_charcoal.jpg,$20.00,$99.99,96
Restore 1,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_1_charcoal.jpg,$20.00,$99.99,842
Restore 1,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_1_charcoal.jpg,$20.00,$99.99,6064
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,44
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,80
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,4425
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,51
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,207
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,1223
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,35
Restore 2,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_2_charcoal_1.jpg,$34.00,$169.99,278
Restore 3,Hatch,https://media.hatchsleep.com/media/catalog/product/cache/9ea3eae6c3e92726b76fcc14e2f0f425/r/e/restore_3_putty_1.jpg,$34.00,$169.99,1275`;

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
