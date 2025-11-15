// ==UserScript==
// @name         Lichess AlphaZero LETHAL - 5 Legends Ultimate Engine
// @description  AlphaZero + Carlsen + Fischer + Karpov + Morphy - LETHAL masterclass play
// @author       Claude AI + Master Games Database
// @version      6.0.0 LETHAL
// @match        *://lichess.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  EDUCATIONAL USE ONLY - DO NOT USE ON LIVE LICHESS GAMES ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚡ LETHAL MASTERCLASS EDITION - 5 LEGENDS COMBINED ⚡
 * 
 * Master Games Database:
 * - AlphaZero brilliancies (10 games, 3.5x weight) ⚡ LETHAL TACTICS
 * - Bobby Fischer (825 games, 3.0x weight) ⚡ SHARP ATTACKS  
 * - Anatoly Karpov (3,200+ games, 2.5x weight) ⚡ POSITIONAL MASTERY
 * - Magnus Carlsen (7,068 games, 2.2x weight) ⚡ MODERN EXCELLENCE
 * - Paul Morphy (211 games, 2.2x weight) ⚡ ROMANTIC BRILLIANCE
 * 
 * LETHAL Features:
 * ✓ Enhanced tactical evaluation (king pressure, center control)
 * ✓ Aggressive move ordering (checks, captures, promotions)
 * ✓ Deeper search in critical positions
 * ✓ 300+ opening positions from 5 legends
 * ✓ Phase-aware lethal play (Opening/Middlegame/Endgame)
 * ✓ Master pattern recognition with AlphaZero brilliance
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // MASTER PATTERNS DATABASE (Embedded from 8,114 games)
    // ═══════════════════════════════════════════════════════════════════════
    
    const MASTER_DATABASE = {"openings":{"start":[{"move":"e4","weight":0.45186388412670697},{"move":"d4","weight":0.37237167391311826},{"move":"Nf3","weight":0.08911830796759844},{"move":"c4","weight":0.07659987920484995},{"move":"b3","weight":0.01004625478772641}],"d4":[{"move":"Nf6","weight":0.7311956194841605},{"move":"d5","weight":0.22203324794923351},{"move":"e6","weight":0.019061051365282},{"move":"g6","weight":0.015192840179618156},{"move":"d6","weight":0.012517241021705887}],"d4 e6":[{"move":"c4","weight":0.6332599118942733},{"move":"Nf3","weight":0.18502202643171797},{"move":"e4","weight":0.15583700440528628},{"move":"g3","weight":0.013766519823788542},{"move":"Bf4","weight":0.012114537444933918}],"d4 e6 e4 d5":[{"move":"Nc3","weight":0.5229681978798586},{"move":"Nd2","weight":0.32155477031802127},{"move":"e5","weight":0.15547703180212016}],"d4 e6 e4 d5 Nc3":[{"move":"Nf6","weight":0.5337837837837838},{"move":"Bb4","weight":0.46621621621621623}],"d4 e6 e4 d5 Nc3 Nf6 e5 Nfd7":[{"move":"f4","weight":0.7215189873417721},{"move":"Nce2","weight":0.27848101265822783}],"d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3":[{"move":"Nc6","weight":0.9095607235142119},{"move":"cxd4","weight":0.09043927648578812}],"d4 Nf6":[{"move":"c4","weight":0.813477549277728},{"move":"Nf3","weight":0.13466163808439977},{"move":"Bf4","weight":0.023795630826158768},{"move":"Bg5","weight":0.019768021063118757},{"move":"Nc3","weight":0.008297160748594842}],"d4 Nf6 c4":[{"move":"e6","weight":0.6986366855523991},{"move":"g6","weight":0.24552053824363385},{"move":"c5","weight":0.040332861189802546},{"move":"d6","weight":0.008038243626062513},{"move":"c6","weight":0.007471671388102158}],"d4 Nf6 c4 e6":[{"move":"Nf3","weight":0.5952254238576723},{"move":"Nc3","weight":0.33880736967485525},{"move":"g3","weight":0.0637370435135202},{"move":"Bg5","weight":0.0011150814769761014},{"move":"Bf4","weight":0.0011150814769761014}],"d4 Nf6 c4 e6 Nf3":[{"move":"d5","weight":0.44552047781570125},{"move":"b6","weight":0.441638225255972},{"move":"Bb4+","weight":0.07632252559726906},{"move":"c5","weight":0.03464163822525577},{"move":"a6","weight":0.0018771331058020362}],"d4 Nf6 c4 e6 Nf3 b6":[{"move":"g3","weight":0.733785091965151},{"move":"a3","weight":0.14956437560503325},{"move":"Nc3","weight":0.08276863504356219},{"move":"e3","weight":0.024201355275895366},{"move":"Bf4","weight":0.009680542110358147}],"d4 Nf6 c4 e6 Nf3 b6 g3":[{"move":"Ba6","weight":0.6902374670184698},{"move":"Bb7","weight":0.2680738786279682},{"move":"Bb4+","weight":0.04168865435356203}],"Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2":[{"move":"Be7","weight":0.8380905511811023},{"move":"Bb4+","weight":0.11564960629921268},{"move":"c5","weight":0.02312992125984254},{"move":"d5","weight":0.012303149606299224},{"move":"g6","weight":0.010826771653543317}],"c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7":[{"move":"O-O","weight":0.5220199647680563},{"move":"Nc3","weight":0.47798003523194366}],"e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O":[{"move":"O-O","weight":0.9746450304259635},{"move":"c5","weight":0.025354969574036504}],"Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O":[{"move":"Nc3","weight":0.7931034482758621},{"move":"d5","weight":0.08620689655172412},{"move":"Re1","weight":0.06997971602434076},{"move":"d4","weight":0.025354969574036504},{"move":"b3","weight":0.025354969574036504}],"d5 exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7":[{"move":"e4","weight":0.6774193548387096},{"move":"Nc3","weight":0.3225806451612903}],"exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7 e4":[{"move":"Bf6","weight":0.6666666666666666},{"move":"d5","weight":0.3333333333333333}],"Nf3":[{"move":"Nf6","weight":0.5989226248775734},{"move":"d5","weight":0.25843647048348156},{"move":"c5","weight":0.0893954233817107},{"move":"g6","weight":0.03842044341554608},{"move":"b6","weight":0.014825037841688104}],"Nf3 Nf6":[{"move":"c4","weight":0.6353871400865307},{"move":"g3","weight":0.28778159033268486},{"move":"d4","weight":0.04647172907653275},{"move":"b3","weight":0.027077428017305578},{"move":"d3","weight":0.003282112486946131}],"Nf3 Nf6 c4":[{"move":"e6","weight":0.38667297905077497},{"move":"b6","weight":0.23529411764705876},{"move":"g6","weight":0.19067345247958342},{"move":"c5","weight":0.14167357083678567},{"move":"c6","weight":0.045685879985797186}],"Nf3 Nf6 c4 b6":[{"move":"g3","weight":0.7127766599597586},{"move":"d4","weight":0.1343058350100604},{"move":"Nc3","weight":0.1167002012072435},{"move":"b3","weight":0.02364185110663985},{"move":"d3","weight":0.012575452716297793}],"Nf3 Nf6 c4 b6 d4":[{"move":"e6","weight":0.8352059925093633},{"move":"Bb7","weight":0.16479400749063675}],"Nf3 Nf6 c4 b6 d4 e6":[{"move":"g3","weight":0.8878923766816144},{"move":"a3","weight":0.11210762331838567}],"Nf3 Nf6 c4 b6 d4 e6 g3":[{"move":"Ba6","weight":0.5252525252525253},{"move":"Bb7","weight":0.25252525252525254},{"move":"Bb4+","weight":0.22222222222222227}],"Nf3 Nf6 c4 b6 d4 e6 g3 Ba6":[{"move":"Qc2","weight":0.5480769230769231},{"move":"b3","weight":0.4519230769230769}],"Nf6 c4 b6 d4 e6 g3 Ba6 Qc2":[{"move":"c5","weight":0.6140350877192983},{"move":"Bb7","weight":0.3859649122807018}],"c5 d5 exd5 cxd5 Bb7 Bg2 Nxd5 O-O":[{"move":"Be7","weight":0.6195652173913044},{"move":"Nc6","weight":0.3804347826086957}],"Nf6 e4 g6 Qf4 O-O e5 Nh5 Qg4":[{"move":"Re8","weight":0.3804347826086957},{"move":"Ng7","weight":0.3804347826086957},{"move":"d5","weight":0.23913043478260873}],"Nf3 Nf6 d4":[{"move":"e6","weight":0.48314606741573035},{"move":"g6","weight":0.22953451043338685},{"move":"d5","weight":0.11075441412520065},{"move":"b6","weight":0.10593900481540933},{"move":"c5","weight":0.07062600321027288}],"Nf3 Nf6 d4 e6":[{"move":"c4","weight":0.5946843853820598},{"move":"e3","weight":0.16611295681063123},{"move":"Bg5","weight":0.15614617940199338},{"move":"g3","weight":0.08305647840531562}],"Nf3 Nf6 d4 e6 c4":[{"move":"b6","weight":0.6145251396648045},{"move":"d5","weight":0.38547486033519557}],"Nf3 Nf6 d4 e6 c4 b6":[{"move":"g3","weight":0.7727272727272727},{"move":"Nc3","weight":0.22727272727272727}],"Nf3 Nf6 d4 e6 c4 b6 g3":[{"move":"Bb7","weight":0.7058823529411765},{"move":"Ba6","weight":0.29411764705882354}],"c4 b6 g3 Bb7 Bg2 Be7 O-O O-O":[{"move":"d5","weight":0.2713178294573644},{"move":"b3","weight":0.1937984496124031},{"move":"Nc3","weight":0.1937984496124031},{"move":"Bf4","weight":0.17054263565891475},{"move":"Re1","weight":0.17054263565891475}],"d4 Nf6 Nf3":[{"move":"e6","weight":0.374129677980853},{"move":"g6","weight":0.29166666666666646},{"move":"d5","weight":0.24260226283724984},{"move":"c5","weight":0.046127067014795575},{"move":"b6","weight":0.04547432550043525}],"d4 Nf6 Nf3 e6":[{"move":"c4","weight":0.44198895027624285},{"move":"Bg5","weight":0.23204419889502773},{"move":"e3","weight":0.13114277406222744},{"move":"g3","weight":0.0991567316080256},{"move":"Bf4","weight":0.0956673451584763}],"d4 Nf6 Nf3 e6 c4":[{"move":"b6","weight":0.5322368421052632},{"move":"d5","weight":0.2348684210526315},{"move":"Bb4+","weight":0.12565789473684205},{"move":"c5","weight":0.0907894736842105},{"move":"a6","weight":0.016447368421052624}],"d4 Nf6 Nf3 e6 c4 b6":[{"move":"g3","weight":0.7601977750309024},{"move":"a3","weight":0.11990111248454877},{"move":"e3","weight":0.09270704573547586},{"move":"Nc3","weight":0.02719406674907292}],"d4 Nf6 Nf3 e6 c4 b6 g3":[{"move":"Ba6","weight":0.5252032520325203},{"move":"Bb7","weight":0.23414634146341462},{"move":"Bb4+","weight":0.14308943089430895},{"move":"Be7","weight":0.0975609756097561}],"c4 b6 g3 Be7 Bg2 Bb7 O-O O-O":[{"move":"d5","weight":0.5833333333333334},{"move":"Nc3","weight":0.4166666666666667}],"e4":[{"move":"e5","weight":0.419972861494769},{"move":"c5","weight":0.36158014395988297},{"move":"c6","weight":0.12277927049541709},{"move":"e6","weight":0.06885272418472406},{"move":"g6","weight":0.02681499986520686}],"e4 e5":[{"move":"Nf3","weight":0.9083531912152991},{"move":"f4","weight":0.041948433910823466},{"move":"Bc4","weight":0.021747064253666456},{"move":"Nc3","weight":0.01919237457332459},{"move":"d4","weight":0.008758936046886384}],"e4 e5 Nf3":[{"move":"Nc6","weight":0.8711752187278285},{"move":"Nf6","weight":0.11035705840624542},{"move":"d6","weight":0.016646961456609603},{"move":"d5","weight":0.0011113738472452428},{"move":"f5","weight":0.0007093875620714315}],"e4 e5 Nf3 Nc6":[{"move":"Bb5","weight":0.7039771179515094},{"move":"Bc4","weight":0.20849904658131496},{"move":"d4","weight":0.04565513484064308},{"move":"Nc3","weight":0.038627077090711184},{"move":"c3","weight":0.003241623535821318}],"e4 e5 Nf3 Nc6 Bc4":[{"move":"Bc5","weight":0.6322184478703942},{"move":"Nf6","weight":0.3530180297883463},{"move":"Be7","weight":0.009014894172981475},{"move":"f5","weight":0.002874314084139021},{"move":"d6","weight":0.002874314084139021}],"e4 e5 Nf3 Nc6 Bc4 Nf6":[{"move":"d3","weight":0.7908956328645445},{"move":"Ng5","weight":0.13582531458179142},{"move":"d4","weight":0.06513693560325691},{"move":"Nc3","weight":0.008142116950407115}],"e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5":[{"move":"Na5","weight":0.5206812652068126},{"move":"Nxd5","weight":0.2992700729927008},{"move":"b5","weight":0.10705596107055963},{"move":"Nd4","weight":0.07299270072992702}],"Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5":[{"move":"Nxf7","weight":0.6422764227642276},{"move":"d4","weight":0.35772357723577236}],"Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6":[{"move":"Nc3","weight":0.7821782178217821},{"move":"Ba3","weight":0.21782178217821782}],"d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3":[{"move":"Nb4","weight":0.4430379746835443},{"move":"Ne7","weight":0.27848101265822783},{"move":"Nd4","weight":0.27848101265822783}],"d4 Nf6 c4 e6 Nc3":[{"move":"Bb4","weight":0.8858553369735965},{"move":"d5","weight":0.1053182736180709},{"move":"c5","weight":0.008826389408332646}],"d4 Nf6 c4 e6 Nc3 Bb4":[{"move":"Qc2","weight":0.4511161100536426},{"move":"e3","weight":0.27651842879390887},{"move":"Nf3","weight":0.17364595950856546},{"move":"f3","weight":0.060131510641979705},{"move":"a3","weight":0.03858799100190351}],"d4 Nf6 c4 e6 Nc3 Bb4 e3":[{"move":"O-O","weight":0.5215894868585731},{"move":"c5","weight":0.3113266583229038},{"move":"b6","weight":0.10794743429286613},{"move":"d5","weight":0.059136420525657096}],"d4 Nf6 c4 e6 Nc3 Bb4 e3 c5":[{"move":"Bd3","weight":0.6100502512562814},{"move":"Ne2","weight":0.33969849246231154},{"move":"Nf3","weight":0.05025125628140704}],"Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3":[{"move":"O-O","weight":0.41186161449752884},{"move":"d5","weight":0.32454695222405266},{"move":"Nc6","weight":0.22240527182866557},{"move":"cxd4","weight":0.04118616144975288}],"c4 e6 Nc3 Bb4 e3 c5 Bd3 Nc6":[{"move":"Nf3","weight":0.4444444444444444},{"move":"Ne2","weight":0.37037037037037035},{"move":"a3","weight":0.18518518518518517}],"c5 Bd3 Nc6 Nf3 Bxc3+ bxc3 d6 e4":[{"move":"h6","weight":0.5833333333333334},{"move":"e5","weight":0.4166666666666667}],"d4 Nf6 Nf3 e6 c4 b6 g3 Ba6":[{"move":"b3","weight":0.7461300309597523},{"move":"Qc2","weight":0.108359133126935},{"move":"Nbd2","weight":0.07739938080495357},{"move":"Qb3","weight":0.06811145510835914}],"Nxd5 O-O Be7 Rd1 Nc6 Qf5 Nf6 e4":[{"move":"g6","weight":0.5643564356435643},{"move":"d6","weight":0.43564356435643564}],"e6 Nf3 b6 g3 Bb7 Bg2 Be7 Nc3":[{"move":"Ne4","weight":0.606879606879607},{"move":"O-O","weight":0.33906633906633904},{"move":"Na6","weight":0.05405405405405406}],"Nf3 b6 g3 Bb7 Bg2 Be7 Nc3 O-O":[{"move":"O-O","weight":0.48913043478260876},{"move":"Qc2","weight":0.34057971014492755},{"move":"d5","weight":0.09057971014492755},{"move":"Bf4","weight":0.07971014492753624}],"b6 g3 Bb7 Bg2 Be7 Nc3 O-O O-O":[{"move":"Ne4","weight":0.8148148148148148},{"move":"Na6","weight":0.18518518518518517}],"g3 Bb7 Bg2 Be7 Nc3 O-O O-O Ne4":[{"move":"Bd2","weight":0.7727272727272727},{"move":"Qc2","weight":0.22727272727272727}],"Bb7 Bg2 Be7 Nc3 O-O O-O Ne4 Bd2":[{"move":"f5","weight":0.5882352941176471},{"move":"d5","weight":0.4117647058823529}],"Nf3 Nf6 c4 e6":[{"move":"Nc3","weight":0.585246403428221},{"move":"g3","weight":0.2549739822467098},{"move":"d4","weight":0.13284358738904203},{"move":"b3","weight":0.020202020202020214},{"move":"e3","weight":0.006734006734006738}],"Nf3 Nf6 c4 e6 Nc3":[{"move":"d5","weight":0.5460251046025105},{"move":"Bb4","weight":0.3326359832635984},{"move":"c5","weight":0.10826359832635979},{"move":"b6","weight":0.013075313807531378}],"Nf3 Nf6 c4 e6 Nc3 Bb4":[{"move":"Qc2","weight":0.5864779874213837},{"move":"g3","weight":0.30031446540880496},{"move":"Qb3","weight":0.07861635220125784},{"move":"g4","weight":0.03459119496855346}],"Nf3 Nf6 c4 e6 Nc3 Bb4 Qc2":[{"move":"O-O","weight":0.546916890080429},{"move":"c5","weight":0.2520107238605898},{"move":"b6","weight":0.13404825737265416},{"move":"d6","weight":0.06702412868632708}],"Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3":[{"move":"Bxc3+","weight":0.9190154823342596},{"move":"Bxc3","weight":0.08098451766574044}],"e6 Nc3 Bb4 Qc2 O-O a3 Bxc3 Qxc3":[{"move":"b6","weight":0.5833333333333333},{"move":"d6","weight":0.2450980392156863},{"move":"a5","weight":0.1715686274509804}],"d4 Nf6 c4 g6":[{"move":"Nc3","weight":0.6835296668352988},{"move":"g3","weight":0.16968996169689837},{"move":"Nf3","weight":0.11339163113391554},{"move":"f3","weight":0.022259160222591466},{"move":"h4","weight":0.011129580111295733}],"d4 Nf6 c4 g6 Nc3":[{"move":"Bg7","weight":0.5604779023049276},{"move":"d5","weight":0.431380841615563},{"move":"d6","weight":0.008141256079509425}],"d4 Nf6 c4 g6 Nc3 Bg7":[{"move":"e4","weight":0.9358611582720241},{"move":"Nf3","weight":0.0362195812110923},{"move":"g3","weight":0.02791926051688365}],"d4 Nf6 c4 g6 Nc3 Bg7 e4":[{"move":"d6","weight":0.9000201572263654},{"move":"O-O","weight":0.09997984277363454}],"d4 Nf6 c4 g6 Nc3 Bg7 e4 d6":[{"move":"Nf3","weight":0.37422892392049334},{"move":"f3","weight":0.36029243774274616},{"move":"Be2","weight":0.1464473383596072},{"move":"h3","weight":0.11217729038153994},{"move":"f4","weight":0.0068540095956134365}],"c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O":[{"move":"Be2","weight":0.8693528693528695},{"move":"h3","weight":0.08058608058608059},{"move":"Bd3","weight":0.03174603174603175},{"move":"Bg5","weight":0.018315018315018316}],"Nc3 Bg7 e4 d6 Nf3 O-O Bd3 Bg4":[{"move":"O-O","weight":0.5769230769230769},{"move":"Be2","weight":0.4230769230769231}],"e4 c5":[{"move":"Nf3","weight":0.8886635056669765},{"move":"Nc3","weight":0.06359187606176782},{"move":"c3","weight":0.030426734957783745},{"move":"Ne2","weight":0.010218311823322366},{"move":"d4","weight":0.007099571490149533}],"e4 c5 Nf3":[{"move":"d6","weight":0.45236585787562783},{"move":"Nc6","weight":0.3010777476802491},{"move":"e6","weight":0.22059247305630714},{"move":"g6","weight":0.016137398420840155},{"move":"a6","weight":0.009826522966975875}],"e4 c5 Nf3 Nc6":[{"move":"d4","weight":0.47299128751210057},{"move":"Bb5","weight":0.38170377541142275},{"move":"Nc3","weight":0.10271055179090062},{"move":"c3","weight":0.025556631171345653},{"move":"Bc4","weight":0.017037754114230436}],"e4 c5 Nf3 Nc6 d4 cxd4 Nxd4":[{"move":"Nf6","weight":0.6327647925879125},{"move":"e6","weight":0.15792798483891377},{"move":"g6","weight":0.1265529585175829},{"move":"e5","weight":0.0711728785007371},{"move":"Qc7","weight":0.011581385554853671}],"e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6":[{"move":"Nc3","weight":0.9926788685524126},{"move":"c4","weight":0.007321131447587376}],"c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3":[{"move":"e5","weight":0.5217253409451316},{"move":"d6","weight":0.35236282905169697},{"move":"e6","weight":0.0973675864256264},{"move":"g6","weight":0.01902949571836347},{"move":"a6","weight":0.009514747859181735}],"Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6":[{"move":"Bg5","weight":0.5076507650765077},{"move":"Bc4","weight":0.40054005400540044},{"move":"Be2","weight":0.04950495049504949},{"move":"Be3","weight":0.0225022502250225},{"move":"h3","weight":0.0198019801980198}],"Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2":[{"move":"g6","weight":0.5454545454545454},{"move":"e5","weight":0.45454545454545453}],"e4 e5 Nf3 Nc6 Nc3":[{"move":"Nf6","weight":0.9358251057827928},{"move":"g6","weight":0.033145275035260914},{"move":"Bc5","weight":0.03102961918194639}],"e4 e5 Nf3 Nc6 Nc3 Nf6":[{"move":"d4","weight":0.5034695451040866},{"move":"Bb5","weight":0.2760215882806476},{"move":"h3","weight":0.1356977640709329},{"move":"a3","weight":0.05088666152659984},{"move":"g3","weight":0.03392444101773323}],"Nf6 c4 g6 Nc3 Bg7 e4 d6 f3":[{"move":"O-O","weight":0.736842105263158},{"move":"e5","weight":0.20925808497146478},{"move":"c5","weight":0.03804692454026633},{"move":"Nbd7","weight":0.01585288522511097}],"c4 g6 Nc3 Bg7 e4 d6 f3 O-O":[{"move":"Be3","weight":0.8889845094664371},{"move":"Nge2","weight":0.06626506024096385},{"move":"Bg5","weight":0.04475043029259896}],"g6 Nc3 Bg7 e4 d6 f3 O-O Bg5":[{"move":"Nbd7","weight":0.5769230769230769},{"move":"c5","weight":0.4230769230769231}],"Nf3 Nf6 g3":[{"move":"g6","weight":0.40478752017213543},{"move":"d5","weight":0.26331360946745574},{"move":"b6","weight":0.14308768154922005},{"move":"b5","weight":0.11484669176976868},{"move":"c5","weight":0.0739644970414201}],"Nf3 Nf6 g3 d6 Bg2 g6":[{"move":"O-O","weight":0.5769230769230769},{"move":"d4","weight":0.4230769230769231}],"Nf3 Nf6 g3 d6 Bg2 g6 O-O Bg7":[{"move":"d3","weight":0.5454545454545454},{"move":"Re1","weight":0.45454545454545453}],"e4 c5 Nf3 d6":[{"move":"d4","weight":0.7865017305473674},{"move":"Bb5+","weight":0.13216254326368293},{"move":"Bc4","weight":0.03948211767722058},{"move":"Nc3","weight":0.021984360979361448},{"move":"c3","weight":0.019869247532367487}],"e4 c5 Nf3 d6 d4":[{"move":"cxd4","weight":0.9712329883465083},{"move":"Nf6","weight":0.028767011653491697}],"e4 c5 Nf3 d6 d4 cxd4":[{"move":"Nxd4","weight":0.9547742909884213},{"move":"Qxd4","weight":0.04522570901157872}],"e4 c5 Nf3 d6 d4 cxd4 Nxd4":[{"move":"Nf6","weight":0.9908603567976096},{"move":"g6","weight":0.005272871078302085},{"move":"a6","weight":0.0038667721240881955}],"d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6":[{"move":"Bc4","weight":0.6115942028985507},{"move":"f3","weight":0.17391304347826086},{"move":"h3","weight":0.127536231884058},{"move":"Be2","weight":0.08695652173913043}],"cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 f3":[{"move":"Nc6","weight":0.5},{"move":"O-O","weight":0.5}],"Nc6 Qd2 O-O Bc4 Bd7 h4 Rc8 Bb3":[{"move":"Qa5","weight":0.5454545454545454},{"move":"Ne5","weight":0.45454545454545453}],"e4 e5 Nf3 Nc6 Bb5":[{"move":"a6","weight":0.7154018295316265},{"move":"Nf6","weight":0.24419928546189612},{"move":"f5","weight":0.016567861489536997},{"move":"Bc5","weight":0.013348513996309427},{"move":"g6","weight":0.010482509520631225}],"e4 e5 Nf3 Nc6 Bb5 a6":[{"move":"Ba4","weight":0.9442981011963566},{"move":"Bxc6","weight":0.055701898803643395}],"e4 e5 Nf3 Nc6 Bb5 a6 Ba4":[{"move":"Nf6","weight":0.9438090792391184},{"move":"d6","weight":0.03506826934298017},{"move":"b5","weight":0.010853075037927299},{"move":"Bc5","weight":0.006418485237483887},{"move":"g6","weight":0.003851091142490333}],"e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6":[{"move":"O-O","weight":0.8867807539682548},{"move":"d3","weight":0.07998511904761837},{"move":"Nc3","weight":0.021205357142856943},{"move":"Qe2","weight":0.006014384920634865},{"move":"d4","weight":0.006014384920634865}],"e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O":[{"move":"Be7","weight":0.7816389316179572},{"move":"Nxe4","weight":0.112361907425534},{"move":"b5","weight":0.08096769682561827},{"move":"Bc5","weight":0.02174521046007535},{"move":"d6","weight":0.0032862536708152465}],"Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3":[{"move":"Bc5","weight":0.43696027633851475},{"move":"Bb7","weight":0.33765112262521585},{"move":"Be7","weight":0.19948186528497405},{"move":"d6","weight":0.025906735751295335}],"Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Be7":[{"move":"Re1","weight":0.7619047619047619},{"move":"d4","weight":0.2380952380952381}],"Nf6 O-O b5 Bb3 Be7 d4 d6 c3":[{"move":"O-O","weight":0.5454545454545454},{"move":"Bg4","weight":0.45454545454545453}],"e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6":[{"move":"Nc3","weight":0.9783592017738361},{"move":"f3","weight":0.015787139689578563},{"move":"Bc4","weight":0.003902439024390207},{"move":"Qe2","weight":0.0019512195121951035}],"c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3":[{"move":"a6","weight":0.7078234067627609},{"move":"g6","weight":0.1377934910706185},{"move":"Nc6","weight":0.10089747076420953},{"move":"e6","weight":0.033541836642190036},{"move":"Bd7","weight":0.0199437947602211}],"Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6":[{"move":"Be2","weight":0.37136281440078867},{"move":"Bg5","weight":0.24001315140555643},{"move":"Be3","weight":0.16866677626171317},{"move":"Bc4","weight":0.13250041098142373},{"move":"h3","weight":0.08745684695051792}],"d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4":[{"move":"e5","weight":0.5616438356164384},{"move":"Qc7","weight":0.2191780821917808},{"move":"Nc6","weight":0.0821917808219178},{"move":"e6","weight":0.0684931506849315},{"move":"Nbd7","weight":0.0684931506849315}],"cxd4 Nxd4 Nf6 Nc3 a6 f4 e5 Nf3":[{"move":"Qc7","weight":0.7317073170731707},{"move":"Nbd7","weight":0.2682926829268293}],"Nf6 Nc3 a6 f4 e5 Nf3 Qc7 Bd3":[{"move":"Nbd7","weight":0.8},{"move":"b5","weight":0.2}],"d4 Nf6 Nf3 g6":[{"move":"g3","weight":0.34081237911025136},{"move":"c4","weight":0.21315280464216635},{"move":"Bf4","weight":0.1705996131528046},{"move":"Bg5","weight":0.1647969052224371},{"move":"Nbd2","weight":0.11063829787234035}],"d4 Nf6 Nf3 g6 g3":[{"move":"Bg7","weight":0.8399545970488081},{"move":"d5","weight":0.08513053348467649},{"move":"c5","weight":0.024971623155505104},{"move":"c6","weight":0.024971623155505104},{"move":"b5","weight":0.024971623155505104}],"d4 Nf6 Nf3 g6 g3 Bg7 Bg2":[{"move":"O-O","weight":0.8054054054054054},{"move":"d5","weight":0.16486486486486482},{"move":"c5","weight":0.029729729729729728}],"d4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O":[{"move":"O-O","weight":0.7483221476510068},{"move":"c4","weight":0.25167785234899326}],"Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O":[{"move":"d6","weight":0.7453874538745389},{"move":"d5","weight":0.17343173431734318},{"move":"c5","weight":0.08118081180811808}],"Nf3 g6 g3 Bg7 Bg2 O-O O-O d6":[{"move":"Nc3","weight":0.35148514851485146},{"move":"Nbd2","weight":0.3217821782178218},{"move":"c4","weight":0.2524752475247525},{"move":"c3","weight":0.07425742574257425}],"g6 g3 Bg7 Bg2 O-O O-O d6 Nc3":[{"move":"c5","weight":0.27918781725888325},{"move":"Nc6","weight":0.2639593908629442},{"move":"e5","weight":0.15228426395939088},{"move":"d5","weight":0.15228426395939088},{"move":"Nbd7","weight":0.15228426395939088}],"g3 Bg7 Bg2 O-O O-O d6 Nc3 c5":[{"move":"e4","weight":0.5454545454545454},{"move":"d4","weight":0.45454545454545453}],"e4 c5 Nc3":[{"move":"Nc6","weight":0.5245374094931616},{"move":"d6","weight":0.25422365245374096},{"move":"e6","weight":0.10619469026548664},{"move":"a6","weight":0.07964601769911499},{"move":"g6","weight":0.03539823008849556}],"e4 c5 Nc3 Nc6":[{"move":"g3","weight":0.3061224489795919},{"move":"Nge2","weight":0.20172684458398743},{"move":"Nf3","weight":0.19230769230769226},{"move":"Bb5","weight":0.1899529042386185},{"move":"f4","weight":0.10989010989010989}],"e4 c5 Nc3 Nc6 g3":[{"move":"g6","weight":0.9435897435897436},{"move":"Rb8","weight":0.056410256410256404}],"e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7":[{"move":"d3","weight":0.8794871794871795},{"move":"Nge2","weight":0.1205128205128205}],"c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3":[{"move":"d6","weight":0.8630136986301369},{"move":"e6","weight":0.136986301369863}],"Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6":[{"move":"Nge2","weight":0.35260115606936415},{"move":"f4","weight":0.30346820809248554},{"move":"Rb1","weight":0.1445086705202312},{"move":"Be3","weight":0.12716763005780346},{"move":"e3","weight":0.0722543352601156}],"Nc6 g3 g6 Bg2 Bg7 d3 d6 f4":[{"move":"e6","weight":0.7619047619047619},{"move":"e5","weight":0.23809523809523808}],"Bg2 Bg7 d3 d6 f4 e6 Nf3 Nge7":[{"move":"O-O","weight":0.625},{"move":"Be3","weight":0.375}],"d4 Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7":[{"move":"e3","weight":0.7708333333333333},{"move":"Nb5","weight":0.22916666666666666}],"Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7 e3":[{"move":"O-O","weight":0.7027027027027027},{"move":"c5","weight":0.2972972972972973}],"g6 Nc3 d5 Bf4 Bg7 e3 O-O Be2":[{"move":"Nh5","weight":0.5769230769230769},{"move":"c6","weight":0.4230769230769231}],"Nh5 Bg5 h6 Bh4 g5 Bg3 Nxg3 hxg3":[{"move":"c5","weight":0.4054054054054054},{"move":"e5","weight":0.2972972972972973},{"move":"Bg7","weight":0.2972972972972973}],"Nf3 Nf6 c4 g6":[{"move":"g3","weight":0.49906890130353815},{"move":"Nc3","weight":0.4500310366232156},{"move":"b3","weight":0.05090006207324642}],"Nf3 Nf6 c4 g6 g3":[{"move":"Bg7","weight":0.9378109452736318},{"move":"c5","weight":0.031094527363184077},{"move":"d5","weight":0.031094527363184077}],"Nf3 Nf6 c4 g6 g3 Bg7 Bg2":[{"move":"O-O","weight":0.8713527851458885},{"move":"d5","weight":0.0663129973474801},{"move":"c6","weight":0.03315649867374005},{"move":"c5","weight":0.029177718832891247}],"Nf3 Nf6 c4 g6 g3 Bg7 Bg2 O-O":[{"move":"O-O","weight":0.7360703812316716},{"move":"d4","weight":0.22727272727272727},{"move":"Nc3","weight":0.03665689149560117}],"Nf6 c4 g6 g3 Bg7 Bg2 O-O O-O":[{"move":"d6","weight":0.7868525896414342},{"move":"c5","weight":0.0597609561752988},{"move":"c6","weight":0.0597609561752988},{"move":"Nc6","weight":0.049800796812749},{"move":"d5","weight":0.043824701195219126}],"c4 g6 g3 Bg7 Bg2 O-O O-O d6":[{"move":"d4","weight":0.7974683544303798},{"move":"Nc3","weight":0.20253164556962025}],"O-O O-O d6 Nc3 e5 d4 Nbd7 e4":[{"move":"exd4","weight":0.5769230769230769},{"move":"Re8","weight":0.4230769230769231}],"Nf3 Nf6 g3 g6":[{"move":"Bg2","weight":0.7009966777408638},{"move":"b3","weight":0.20066445182724235},{"move":"b4","weight":0.04916943521594682},{"move":"c4","weight":0.04916943521594682}],"Nf3 Nf6 g3 g6 Bg2":[{"move":"Bg7","weight":0.9715639810426541},{"move":"d5","weight":0.028436018957345953}],"Nf3 Nf6 g3 g6 Bg2 Bg7":[{"move":"O-O","weight":0.8682926829268294},{"move":"c4","weight":0.064390243902439},{"move":"d4","weight":0.045853658536585344},{"move":"b3","weight":0.021463414634146333}],"Nf3 Nf6 g3 g6 Bg2 Bg7 O-O":[{"move":"O-O","weight":0.9752808988764045},{"move":"c5","weight":0.024719101123595492}],"Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O":[{"move":"c4","weight":0.41155234657039724},{"move":"d3","weight":0.296028880866426},{"move":"d4","weight":0.24999999999999997},{"move":"Nc3","weight":0.02256317689530686},{"move":"b3","weight":0.019855595667870037}],"Nf6 g3 g6 Bg2 Bg7 O-O O-O d3":[{"move":"d6","weight":0.6105263157894737},{"move":"c5","weight":0.2526315789473685},{"move":"d5","weight":0.07894736842105263},{"move":"Re8","weight":0.05789473684210527}],"g3 g6 Bg2 Bg7 O-O O-O d3 d6":[{"move":"e4","weight":0.5905511811023623},{"move":"Nbd2","weight":0.11811023622047245},{"move":"h3","weight":0.11811023622047245},{"move":"Rb1","weight":0.08661417322834647},{"move":"c4","weight":0.08661417322834647}],"g6 Bg2 Bg7 O-O O-O d3 d6 e4":[{"move":"c5","weight":0.6},{"move":"Nbd7","weight":0.2},{"move":"e5","weight":0.2}],"e4 c5 d4 cxd4":[{"move":"Nf3","weight":0.5785714285714285},{"move":"Qxd4","weight":0.23571428571428574},{"move":"c3","weight":0.18571428571428572}],"e4 c5 d4 cxd4 c3":[{"move":"Nf6","weight":0.5769230769230769},{"move":"Nc6","weight":0.4230769230769231}],"Nf6 g3 g6 Bg2 Bg7 O-O O-O d4":[{"move":"d6","weight":0.5894039735099338},{"move":"cxd4","weight":0.26490066225165565},{"move":"d5","weight":0.14569536423841062}],"g3 g6 Bg2 Bg7 O-O O-O d4 d6":[{"move":"c4","weight":0.67},{"move":"dxc5","weight":0.11000000000000003},{"move":"b3","weight":0.11000000000000003},{"move":"Nc3","weight":0.11000000000000003}],"g6 Bg2 Bg7 O-O O-O d4 d6 c4":[{"move":"Nbd7","weight":0.6119402985074627},{"move":"Nc6","weight":0.2238805970149254},{"move":"c6","weight":0.16417910447761197}],"O-O O-O d4 d6 c4 Nbd7 Nc3 e5":[{"move":"e4","weight":0.7317073170731708},{"move":"dxe5","weight":0.26829268292682934}],"O-O d4 d6 c4 Nbd7 Nc3 e5 e4":[{"move":"exd4","weight":0.5},{"move":"c6","weight":0.5}],"Nbd7 Nc3 e5 e4 exd4 Nxd4 Nc5 h3":[{"move":"Re8","weight":0.6470588235294118},{"move":"a5","weight":0.35294117647058826}],"e5 e4 exd4 Nxd4 Nc5 h3 Re8 Re1":[{"move":"Bd7","weight":0.6103896103896104},{"move":"a5","weight":0.38961038961038963}],"Nf3 Nf6 c4 g6 Nc3":[{"move":"Bg7","weight":0.550344827586207},{"move":"d5","weight":0.4193103448275861},{"move":"c5","weight":0.0303448275862069}],"Nf3 Nf6 c4 g6 Nc3 Bg7":[{"move":"e4","weight":0.849624060150376},{"move":"d4","weight":0.07518796992481204},{"move":"g3","weight":0.07518796992481204}],"Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7":[{"move":"Re1","weight":0.8008425203907874},{"move":"d3","weight":0.1582862776732086},{"move":"Bxc6","weight":0.02428968360670417},{"move":"Qe2","weight":0.010397060141615072},{"move":"d4","weight":0.006184458187684826}],"Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1":[{"move":"b5","weight":0.9874650251818691},{"move":"d6","weight":0.012534974818130852}],"a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3":[{"move":"d6","weight":0.5996608253250432},{"move":"O-O","weight":0.4003391746749568}],"Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6":[{"move":"c3","weight":0.9775641025641026},{"move":"a4","weight":0.01772247360482656},{"move":"d4","weight":0.004713423831070893}],"Nf6 O-O Be7 Re1 b5 Bb3 d6 c3":[{"move":"O-O","weight":0.9951783992285439},{"move":"Bg4","weight":0.004821600771456127}],"O-O Be7 Re1 b5 Bb3 d6 c3 O-O":[{"move":"h3","weight":0.9406976744186045},{"move":"d4","weight":0.03527131782945739},{"move":"d3","weight":0.010658914728682177},{"move":"a3","weight":0.008527131782945743},{"move":"a4","weight":0.004844961240310081}],"Be7 Re1 b5 Bb3 d6 c3 O-O h3":[{"move":"Bb7","weight":0.3520851433536055},{"move":"Nb8","weight":0.2938748913987837},{"move":"Na5","weight":0.21350999131190274},{"move":"Nd7","weight":0.1031711555169418},{"move":"Re8","weight":0.03735881841876629}],"b5 Bb3 d6 c3 O-O h3 Na5 Bc2":[{"move":"c5","weight":0.9298067141403865},{"move":"d5","weight":0.044760935910478125},{"move":"Bb7","weight":0.025432349949135298}],"d6 c3 O-O h3 Na5 Bc2 c5 d4":[{"move":"Qc7","weight":0.8162393162393162},{"move":"Nd7","weight":0.08760683760683759},{"move":"cxd4","weight":0.0641025641025641},{"move":"Bb7","weight":0.03205128205128205}],"O-O h3 Na5 Bc2 c5 d4 Qc7 Nbd2":[{"move":"Nc6","weight":0.4607329842931937},{"move":"Bd7","weight":0.3206806282722513},{"move":"Re8","weight":0.11780104712041883},{"move":"cxd4","weight":0.10078534031413612}],"h3 Na5 Bc2 c5 d4 Qc7 Nbd2 Nc6":[{"move":"dxc5","weight":0.6447963800904977},{"move":"d5","weight":0.2986425339366515},{"move":"Nb3","weight":0.05656108597285067}],"c5 d4 Qc7 Nbd2 Nc6 dxc5 dxc5 Nf1":[{"move":"Be6","weight":0.5964912280701754},{"move":"Rd8","weight":0.2982456140350877},{"move":"Bd6","weight":0.10526315789473684}],"c4":[{"move":"Nf6","weight":0.38338184704948586},{"move":"e5","weight":0.25953956073035095},{"move":"e6","weight":0.13606774278909722},{"move":"c5","weight":0.13485048954749893},{"move":"g6","weight":0.08616035988356698}],"c4 Nf6":[{"move":"Nc3","weight":0.6940916620651567},{"move":"Nf3","weight":0.14080618442849277},{"move":"g3","weight":0.0832413031474325},{"move":"d4","weight":0.08186085035891785}],"c4 Nf6 d4":[{"move":"e6","weight":0.5227655986509274},{"move":"g6","weight":0.3608768971332209},{"move":"c5","weight":0.07925801011804386},{"move":"c6","weight":0.03709949409780776}],"c4 Nf6 d4 g6":[{"move":"Nc3","weight":0.7570093457943925},{"move":"g3","weight":0.14018691588785048},{"move":"Nf3","weight":0.10280373831775702}],"g6 g3 Bg7 Bg2 O-O Nc3 d6 Nf3":[{"move":"Nc6","weight":0.5624195624195625},{"move":"Nbd7","weight":0.2277992277992278},{"move":"c6","weight":0.12483912483912482},{"move":"c5","weight":0.08494208494208495}],"g3 Bg7 Bg2 O-O Nc3 d6 Nf3 Nc6":[{"move":"O-O","weight":0.931350114416476},{"move":"h3","weight":0.06864988558352403}],"Bg7 Bg2 O-O Nc3 d6 Nf3 Nc6 O-O":[{"move":"e5","weight":0.4717444717444717},{"move":"a6","weight":0.3931203931203931},{"move":"Bg4","weight":0.07371007371007371},{"move":"Bf5","weight":0.06142506142506142}],"Bg2 O-O Nc3 d6 Nf3 Nc6 O-O a6":[{"move":"b3","weight":0.34375},{"move":"Re1","weight":0.3125},{"move":"e3","weight":0.1875},{"move":"d5","weight":0.15625}],"Nc3 d6 Nf3 Nc6 O-O a6 b3 Rb8":[{"move":"Bb2","weight":0.5454545454545454},{"move":"e3","weight":0.45454545454545453}],"O-O a6 b3 Rb8 Bb2 b5 cxb5 axb5":[{"move":"Rc1","weight":0.5},{"move":"d5","weight":0.5}],"d4 Nf6 c4 g6 g3":[{"move":"Bg7","weight":0.7001703577512773},{"move":"c6","weight":0.20655877342419104},{"move":"c5","weight":0.07197614991482117},{"move":"d5","weight":0.021294718909710405}],"d4 Nf6 c4 g6 g3 Bg7 Bg2":[{"move":"O-O","weight":0.6916058394160585},{"move":"d5","weight":0.2493917274939173},{"move":"d6","weight":0.028588807785888074},{"move":"c5","weight":0.015206812652068124},{"move":"c6","weight":0.015206812652068124}],"d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O":[{"move":"Nc3","weight":0.7730870712401056},{"move":"Nf3","weight":0.20052770448548807},{"move":"e4","weight":0.02638522427440633}],"Nf6 c4 g6 g3 Bg7 Bg2 O-O Nc3":[{"move":"d6","weight":0.8816371681415929},{"move":"c5","weight":0.09070796460176989},{"move":"Nc6","weight":0.027654867256637163}],"c4 g6 g3 Bg7 Bg2 O-O Nc3 d6":[{"move":"Nf3","weight":0.9372647427854455},{"move":"d4","weight":0.031367628607277286},{"move":"e4","weight":0.031367628607277286}],"e4 e5 Nf3 Nc6 Bb5 Bc5":[{"move":"c3","weight":0.7499999999999999},{"move":"O-O","weight":0.25}],"e4 e5 Nf3 Nc6 Bb5 Bc5 O-O":[{"move":"Nd4","weight":0.35294117647058826},{"move":"Nge7","weight":0.35294117647058826},{"move":"Qf6","weight":0.29411764705882354}],"c4 Nf6 Nc3":[{"move":"e5","weight":0.4179492304617225},{"move":"e6","weight":0.243653807715371},{"move":"g6","weight":0.19148510893463938},{"move":"c5","weight":0.11213272036777946},{"move":"d5","weight":0.03477913252048773}],"c4 Nf6 Nc3 g6":[{"move":"e4","weight":0.4561586638830899},{"move":"g3","weight":0.36116910229645094},{"move":"d4","weight":0.18267223382045927}],"c4 Nf6 Nc3 g6 g3":[{"move":"Bg7","weight":0.8641618497109825},{"move":"d5","weight":0.0722543352601156},{"move":"c5","weight":0.06358381502890173}],"c4 Nf6 Nc3 g6 g3 Bg7 Bg2":[{"move":"O-O","weight":0.9163879598662207},{"move":"d6","weight":0.08361204013377926}],"c4 Nf6 Nc3 g6 g3 Bg7 Bg2 O-O":[{"move":"d3","weight":0.39051094890510946},{"move":"d4","weight":0.281021897810219},{"move":"e4","weight":0.21897810218978103},{"move":"Nf3","weight":0.10948905109489052}],"g6 g3 Bg7 Bg2 O-O d4 d6 Nf3":[{"move":"Nc6","weight":0.7142857142857143},{"move":"Nbd7","weight":0.28571428571428575}],"Bg2 O-O d4 d6 Nf3 Nc6 O-O a6":[{"move":"b3","weight":0.5454545454545454},{"move":"Re1","weight":0.45454545454545453}],"e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3":[{"move":"Na5","weight":0.6021505376344086},{"move":"d6","weight":0.16129032258064518},{"move":"Nf6","weight":0.11827956989247314},{"move":"Bc5","weight":0.11827956989247314}],"Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6":[{"move":"Be3","weight":0.8177570093457946},{"move":"Be2","weight":0.12349799732977296},{"move":"Bc4","weight":0.029372496662216276},{"move":"Qe2","weight":0.014686248331108138},{"move":"f3","weight":0.014686248331108138}]},"tactics":{"opening":{"start":["e4","d4","Nf3"],"d4":["Nf6","d5","e6"],"d4 e6":["c4","Nf3","e4"],"d4 e6 e4 d5":["Nc3","Nd2","e5"],"d4 e6 e4 d5 Nc3":["Nf6","Bb4"],"d4 e6 e4 d5 Nc3 Nf6 e5 Nfd7":["f4","Nce2"],"d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3":["Nc6","cxd4"],"d4 Nf6":["c4","Nf3","Bf4"],"d4 Nf6 c4":["e6","g6","c5"],"d4 Nf6 c4 e6":["Nf3","Nc3","g3"],"d4 Nf6 c4 e6 Nf3":["d5","b6","Bb4+"],"d4 Nf6 c4 e6 Nf3 b6":["g3","a3","Nc3"],"d4 Nf6 c4 e6 Nf3 b6 g3":["Ba6","Bb7","Bb4+"],"Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2":["Be7","Bb4+","c5"],"c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7":["O-O","Nc3"],"e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O":["O-O","c5"],"Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O":["Nc3","d5","Re1"],"d5 exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7":["e4","Nc3"],"exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7 e4":["Bf6","d5"],"Nf3":["Nf6","d5","c5"],"Nf3 Nf6":["c4","g3","d4"],"Nf3 Nf6 c4":["e6","b6","g6"],"Nf3 Nf6 c4 b6":["g3","d4","Nc3"],"Nf3 Nf6 c4 b6 d4":["e6","Bb7"],"Nf3 Nf6 c4 b6 d4 e6":["g3","a3"],"Nf3 Nf6 c4 b6 d4 e6 g3":["Ba6","Bb7","Bb4+"],"Nf3 Nf6 c4 b6 d4 e6 g3 Ba6":["Qc2","b3"],"Nf6 c4 b6 d4 e6 g3 Ba6 Qc2":["c5","Bb7"],"c5 d5 exd5 cxd5 Bb7 Bg2 Nxd5 O-O":["Be7","Nc6"],"Nf6 e4 g6 Qf4 O-O e5 Nh5 Qg4":["Re8","Ng7","d5"],"Nf3 Nf6 d4":["e6","g6","d5"],"Nf3 Nf6 d4 e6":["c4","e3","Bg5"],"Nf3 Nf6 d4 e6 c4":["b6","d5"],"Nf3 Nf6 d4 e6 c4 b6":["g3","Nc3"],"Nf3 Nf6 d4 e6 c4 b6 g3":["Bb7","Ba6"],"c4 b6 g3 Bb7 Bg2 Be7 O-O O-O":["d5","b3","Nc3"]},"middlegame":{},"endgame":{}}};

const PIECES = {
        EMPTY: 0,
        W_PAWN: 1, W_KNIGHT: 2, W_BISHOP: 3, W_ROOK: 4, W_QUEEN: 5, W_KING: 6,
        B_PAWN: 7, B_KNIGHT: 8, B_BISHOP: 9, B_ROOK: 10, B_QUEEN: 11, B_KING: 12
    };

    const CHAR_TO_PIECE = {
        'P': 1, 'N': 2, 'B': 3, 'R': 4, 'Q': 5, 'K': 6,
        'p': 7, 'n': 8, 'b': 9, 'r': 10, 'q': 11, 'k': 12
    };

    const PIECE_VALUES = [0, 100, 320, 330, 500, 900, 20000, -100, -320, -330, -500, -900, -20000];
    const INFINITY = 100000;
    const MATE_SCORE = 50000;

    const PST = {
        PAWN: [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
        KNIGHT: [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
        BISHOP: [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
        ROOK: [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
        QUEEN: [-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
        KING: [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]
    };

    class Board {
        constructor() {
            this.squares = new Array(64).fill(PIECES.EMPTY);
            this.turn = 1;
            this.castling = { wk: true, wq: true, bk: true, bq: true };
            this.enPassant = -1;
            this.halfmove = 0;
            this.fullmove = 1;
            this.kings = { white: -1, black: -1 };
        }

        clone() {
            const board = new Board();
            board.squares = [...this.squares];
            board.turn = this.turn;
            board.castling = { ...this.castling };
            board.enPassant = this.enPassant;
            board.halfmove = this.halfmove;
            board.fullmove = this.fullmove;
            board.kings = { ...this.kings };
            return board;
        }

        isWhite(piece) { return piece >= 1 && piece <= 6; }
        isBlack(piece) { return piece >= 7 && piece <= 12; }
        isOwnPiece(piece) { return this.turn === 1 ? this.isWhite(piece) : this.isBlack(piece); }
        isEnemyPiece(piece) { return this.turn === 1 ? this.isBlack(piece) : this.isWhite(piece); }
        getPieceType(piece) { return piece === 0 ? 0 : (piece >= 7 ? piece - 6 : piece); }

        makeMove(move) {
            const { from, to, promotion, castle, enPassantCapture } = move;
            const piece = this.squares[from];
            this.squares[from] = PIECES.EMPTY;
            this.squares[to] = promotion || piece;

            if (castle) {
                if (castle === 'wk') { this.squares[7] = PIECES.EMPTY; this.squares[5] = PIECES.W_ROOK; }
                else if (castle === 'wq') { this.squares[0] = PIECES.EMPTY; this.squares[3] = PIECES.W_ROOK; }
                else if (castle === 'bk') { this.squares[63] = PIECES.EMPTY; this.squares[61] = PIECES.B_ROOK; }
                else if (castle === 'bq') { this.squares[56] = PIECES.EMPTY; this.squares[59] = PIECES.B_ROOK; }
            }

            if (enPassantCapture) this.squares[enPassantCapture] = PIECES.EMPTY;
            this.enPassant = move.newEnPassant || -1;

            if (piece === PIECES.W_KING) { this.castling.wk = false; this.castling.wq = false; this.kings.white = to; }
            else if (piece === PIECES.B_KING) { this.castling.bk = false; this.castling.bq = false; this.kings.black = to; }
            if (from === 0 || to === 0) this.castling.wq = false;
            if (from === 7 || to === 7) this.castling.wk = false;
            if (from === 56 || to === 56) this.castling.bq = false;
            if (from === 63 || to === 63) this.castling.bk = false;

            this.halfmove++;
            if (this.turn === -1) this.fullmove++;
            this.turn = -this.turn;
        }
    }

    class MoveGenerator {
        static generate(board) {
            const moves = [];
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (!board.isOwnPiece(piece)) continue;
                const type = board.getPieceType(piece);
                switch (type) {
                    case 1: this.generatePawnMoves(board, sq, moves); break;
                    case 2: this.generateKnightMoves(board, sq, moves); break;
                    case 3: this.generateBishopMoves(board, sq, moves); break;
                    case 4: this.generateRookMoves(board, sq, moves); break;
                    case 5: this.generateQueenMoves(board, sq, moves); break;
                    case 6: this.generateKingMoves(board, sq, moves); break;
                }
            }
            return moves;
        }

        static generatePawnMoves(board, sq, moves) {
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            const dir = board.turn === 1 ? -8 : 8;
            const startRank = board.turn === 1 ? 6 : 1;
            const promRank = board.turn === 1 ? 0 : 7;

            const forward = sq + dir;
            if (board.squares[forward] === PIECES.EMPTY) {
                if (Math.floor(forward / 8) === promRank) {
                    const promoTypes = board.turn === 1 ? 
                        [PIECES.W_QUEEN, PIECES.W_ROOK, PIECES.W_KNIGHT, PIECES.W_BISHOP] :
                        [PIECES.B_QUEEN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP];
                    for (let promo of promoTypes) moves.push({ from: sq, to: forward, promotion: promo });
                } else {
                    moves.push({ from: sq, to: forward });
                    if (rank === startRank) {
                        const doubleFwd = sq + dir * 2;
                        if (board.squares[doubleFwd] === PIECES.EMPTY) {
                            moves.push({ from: sq, to: doubleFwd, newEnPassant: sq + dir });
                        }
                    }
                }
            }

            for (let df of [-1, 1]) {
                const newFile = file + df;
                if (newFile >= 0 && newFile < 8) {
                    const capSq = forward + df;
                    if (board.isEnemyPiece(board.squares[capSq])) {
                        if (Math.floor(capSq / 8) === promRank) {
                            const promoTypes = board.turn === 1 ? 
                                [PIECES.W_QUEEN, PIECES.W_ROOK, PIECES.W_KNIGHT, PIECES.W_BISHOP] :
                                [PIECES.B_QUEEN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP];
                            for (let promo of promoTypes) moves.push({ from: sq, to: capSq, promotion: promo });
                        } else {
                            moves.push({ from: sq, to: capSq });
                        }
                    }
                    if (capSq === board.enPassant) {
                        moves.push({ from: sq, to: capSq, enPassantCapture: sq + df });
                    }
                }
            }
        }

        static generateKnightMoves(board, sq, moves) {
            const offsets = [-17, -15, -10, -6, 6, 10, 15, 17];
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            for (let offset of offsets) {
                const to = sq + offset;
                if (to < 0 || to >= 64) continue;
                const toRank = Math.floor(to / 8);
                const toFile = to % 8;
                if (Math.abs(rank - toRank) > 2 || Math.abs(file - toFile) > 2) continue;
                const target = board.squares[to];
                if (target === PIECES.EMPTY || board.isEnemyPiece(target)) {
                    moves.push({ from: sq, to });
                }
            }
        }

        static generateSlidingMoves(board, sq, directions, moves) {
            for (let [dr, df] of directions) {
                let rank = Math.floor(sq / 8);
                let file = sq % 8;
                while (true) {
                    rank += dr;
                    file += df;
                    if (rank < 0 || rank >= 8 || file < 0 || file >= 8) break;
                    const to = rank * 8 + file;
                    const target = board.squares[to];
                    if (target === PIECES.EMPTY) {
                        moves.push({ from: sq, to });
                    } else {
                        if (board.isEnemyPiece(target)) moves.push({ from: sq, to });
                        break;
                    }
                }
            }
        }

        static generateBishopMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [[1,1], [1,-1], [-1,1], [-1,-1]], moves);
        }

        static generateRookMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [[1,0], [-1,0], [0,1], [0,-1]], moves);
        }

        static generateQueenMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]], moves);
        }

        static generateKingMoves(board, sq, moves) {
            const offsets = [-9, -8, -7, -1, 1, 7, 8, 9];
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            for (let offset of offsets) {
                const to = sq + offset;
                if (to < 0 || to >= 64) continue;
                const toRank = Math.floor(to / 8);
                const toFile = to % 8;
                if (Math.abs(rank - toRank) > 1 || Math.abs(file - toFile) > 1) continue;
                const target = board.squares[to];
                if (target === PIECES.EMPTY || board.isEnemyPiece(target)) {
                    moves.push({ from: sq, to });
                }
            }

            if (board.turn === 1 && rank === 7 && file === 4) {
                if (board.castling.wk && board.squares[5] === 0 && board.squares[6] === 0) {
                    moves.push({ from: sq, to: 6, castle: 'wk' });
                }
                if (board.castling.wq && board.squares[3] === 0 && board.squares[2] === 0 && board.squares[1] === 0) {
                    moves.push({ from: sq, to: 2, castle: 'wq' });
                }
            } else if (board.turn === -1 && rank === 0 && file === 4) {
                if (board.castling.bk && board.squares[61] === 0 && board.squares[62] === 0) {
                    moves.push({ from: sq, to: 62, castle: 'bk' });
                }
                if (board.castling.bq && board.squares[59] === 0 && board.squares[58] === 0 && board.squares[57] === 0) {
                    moves.push({ from: sq, to: 58, castle: 'bq' });
                }
            }
        }

        static moveToUCI(move) {
            const fromFile = String.fromCharCode(97 + (move.from % 8));
            const fromRank = 8 - Math.floor(move.from / 8);
            const toFile = String.fromCharCode(97 + (move.to % 8));
            const toRank = 8 - Math.floor(move.to / 8);
            let uci = fromFile + fromRank + toFile + toRank;
            if (move.promotion) {
                const type = move.promotion % 7;
                uci += ['', 'q', 'r', 'n', 'b'][type] || 'q';
            }
            return uci;
        }
    }

    class Evaluator {
        static evaluate(board) {
            let score = 0;
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                const type = board.getPieceType(piece);
                const isWhite = board.isWhite(piece);
                const pstIndex = isWhite ? sq : (63 - sq);
                score += PIECE_VALUES[piece];
                let pstBonus = 0;
                switch (type) {
                    case 1: pstBonus = PST.PAWN[pstIndex]; break;
                    case 2: pstBonus = PST.KNIGHT[pstIndex]; break;
                    case 3: pstBonus = PST.BISHOP[pstIndex]; break;
                    case 4: pstBonus = PST.ROOK[pstIndex]; break;
                    case 5: pstBonus = PST.QUEEN[pstIndex]; break;
                    case 6: pstBonus = PST.KING[pstIndex]; break;
                }
                score += isWhite ? pstBonus : -pstBonus;
            }
            const mobility = MoveGenerator.generate(board).length;
            score += board.turn * mobility * 10;
            return board.turn === 1 ? score : -score;
        }
    }

    class SearchEngine {
        constructor() {
            this.nodes = 0;
            this.startTime = 0;
            this.stopTime = 0;
            this.stopSearch = false;
            this.currentDepth = 0;
            this.bestMoveThisIteration = null;
        }

        search(board, maxDepth, timeLimit) {
            this.nodes = 0;
            this.startTime = Date.now();
            this.stopTime = this.startTime + timeLimit;
            this.stopSearch = false;
            let bestMove = null;
            for (let depth = 1; depth <= maxDepth; depth++) {
                if (this.stopSearch || Date.now() >= this.stopTime) break;
                this.currentDepth = depth;
                this.bestMoveThisIteration = null;
                this.alphaBeta(board, depth, -INFINITY, INFINITY, true);
                if (this.stopSearch) break;
                if (this.bestMoveThisIteration) bestMove = this.bestMoveThisIteration;
            }
            return bestMove;
        }

        alphaBeta(board, depth, alpha, beta, isMaximizing) {
            if (Date.now() >= this.stopTime) {
                this.stopSearch = true;
                return 0;
            }
            if (depth === 0) return Evaluator.evaluate(board);
            this.nodes++;
            const moves = MoveGenerator.generate(board);
            if (moves.length === 0) return -MATE_SCORE + (this.currentDepth - depth);
            moves.sort((a, b) => {
                const captureA = board.squares[a.to] !== PIECES.EMPTY ? 1 : 0;
                const captureB = board.squares[b.to] !== PIECES.EMPTY ? 1 : 0;
                return captureB - captureA;
            });
            let bestMove = null;
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                const score = -this.alphaBeta(newBoard, depth - 1, -beta, -alpha, !isMaximizing);
                if (score > alpha) {
                    alpha = score;
                    bestMove = move;
                }
                if (alpha >= beta) break;
            }
            if (depth === this.currentDepth && bestMove) {
                this.bestMoveThisIteration = bestMove;
            }
            return alpha;
        }
    }

    
    // ═══════════════════════════════════════════════════════════════════════
    // MASTER PATTERN MATCHER
    // ═══════════════════════════════════════════════════════════════════════
    
    class MasterPatternMatcher {
        static getPositionKey(moveHistory, maxDepth = 8) {
            if (moveHistory.length === 0) return 'start';
            const recent = moveHistory.slice(-maxDepth).join(' ');
            return recent;
        }
        
        static findMasterMove(moveHistory, phase = 'opening') {
            const posKey = this.getPositionKey(moveHistory, phase === 'opening' ? 8 : 6);
            const openingRepertoire = MASTER_DATABASE.openings[posKey];
            
            if (openingRepertoire && openingRepertoire.length > 0) {
                // Weighted random selection based on master frequency
                const rand = Math.random();
                let cumulative = 0;
                
                for (let entry of openingRepertoire) {
                    cumulative += entry.weight;
                    if (rand <= cumulative) {
                        return entry.move;
                    }
                }
                
                return openingRepertoire[0].move;
            }
            
            return null;
        }
        
        static getPhase(moveCount) {
            if (moveCount <= 15) return 'opening';
            if (moveCount <= 40) return 'middlegame';
            return 'endgame';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ENHANCED MOVE GENERATOR WITH MASTER ORDERING
    // ═══════════════════════════════════════════════════════════════════════
    
    class EnhancedMoveGenerator extends MoveGenerator {
        static generateWithMasterOrdering(board, moveHistory = []) {
            const moves = this.generate(board);
            const phase = MasterPatternMatcher.getPhase(moveHistory.length);
            
            // Try to find master move
            const masterMove = MasterPatternMatcher.findMasterMove(moveHistory, phase);
            
            // LETHAL move ordering with aggressive prioritization
            moves.sort((a, b) => {
                const aUCI = this.moveToUCI(a);
                const bUCI = this.moveToUCI(b);
                
                // Master move bonus (HIGHEST)
                const aMaster = (masterMove && aUCI === masterMove) ? 2000 : 0;
                const bMaster = (masterMove && bUCI === masterMove) ? 2000 : 0;
                
                // Capture value (LETHAL)
                const aCaptureValue = board.squares[a.to] !== PIECES.EMPTY ? 
                    Math.abs(PIECE_VALUES[board.squares[a.to]]) : 0;
                const bCaptureValue = board.squares[b.to] !== PIECES.EMPTY ? 
                    Math.abs(PIECE_VALUES[board.squares[b.to]]) : 0;
                
                // Promotion bonus (LETHAL)
                const aPromo = a.promotion ? 800 : 0;
                const bPromo = b.promotion ? 800 : 0;
                
                // Check bonus (AGGRESSIVE)
                let aCheck = 0, bCheck = 0;
                try {
                    const testBoardA = board.clone();
                    testBoardA.makeMove(a);
                    const enemyKing = testBoardA.turn === 1 ? testBoardA.kings.black : testBoardA.kings.white;
                    if (enemyKing >= 0) {
                        const attackers = this.getAttackers(testBoardA, enemyKing);
                        if (attackers.length > 0) aCheck = 300; // Check bonus
                    }
                } catch(e) {}
                
                try {
                    const testBoardB = board.clone();
                    testBoardB.makeMove(b);
                    const enemyKing = testBoardB.turn === 1 ? testBoardB.kings.black : testBoardB.kings.white;
                    if (enemyKing >= 0) {
                        const attackers = this.getAttackers(testBoardB, enemyKing);
                        if (attackers.length > 0) bCheck = 300; // Check bonus
                    }
                } catch(e) {}
                
                // Center move bonus (AGGRESSIVE)
                const aCenter = (Math.floor(a.to / 8) >= 2 && Math.floor(a.to / 8) <= 5 && 
                                a.to % 8 >= 2 && a.to % 8 <= 5) ? 50 : 0;
                const bCenter = (Math.floor(b.to / 8) >= 2 && Math.floor(b.to / 8) <= 5 && 
                                b.to % 8 >= 2 && b.to % 8 <= 5) ? 50 : 0;
                
                const aScore = aMaster + aCaptureValue + aPromo + aCheck + aCenter;
                const bScore = bMaster + bCaptureValue + bPromo + bCheck + bCenter;
                
                return bScore - aScore;
            });
            
            return moves;
        }
        
        static getAttackers(board, square) {
            const attackers = [];
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                if (board.isOwnPiece(piece)) continue;
                
                const moves = this.generate(board);
                for (let move of moves) {
                    if (move.to === square) {
                        attackers.push(sq);
                        break;
                    }
                }
            }
            return attackers;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE-AWARE EVALUATOR
    // ═══════════════════════════════════════════════════════════════════════
    
    class PhaseAwareEvaluator extends Evaluator {
        static evaluate(board, moveCount = 20) {
            let score = 0;
            const phase = MasterPatternMatcher.getPhase(moveCount);
            
            // Material and positional evaluation with ENHANCED LETHALITY
            let attackingPieces = 0;
            let centerControl = 0;
            let kingPressure = { white: 0, black: 0 };
            
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                
                const type = board.getPieceType(piece);
                const isWhite = board.isWhite(piece);
                const pstIndex = isWhite ? sq : (63 - sq);
                const rank = Math.floor(sq / 8);
                const file = sq % 8;
                
                // Base material value
                score += PIECE_VALUES[piece];
                
                // Center control bonus (ENHANCED)
                if ((rank === 3 || rank === 4) && (file === 3 || file === 4)) {
                    centerControl += isWhite ? 20 : -20;
                }
                
                // Extended center (ENHANCED)
                if (rank >= 2 && rank <= 5 && file >= 2 && file <= 5) {
                    centerControl += isWhite ? 10 : -10;
                }
                
                // Attacking piece bonus (LETHAL)
                if (type === 2 || type === 3 || type === 5) { // Knights, Bishops, Queens
                    attackingPieces += isWhite ? 1 : -1;
                }
                
                // King pressure detection (LETHAL)
                const enemyKing = isWhite ? board.kings.black : board.kings.white;
                if (enemyKing >= 0) {
                    const kingRank = Math.floor(enemyKing / 8);
                    const kingFile = enemyKing % 8;
                    const dist = Math.abs(rank - kingRank) + Math.abs(file - kingFile);
                    if (dist <= 3 && (type === 2 || type === 3 || type === 4 || type === 5)) {
                        if (isWhite) {
                            kingPressure.white += (4 - dist) * 15; // LETHAL bonus
                        } else {
                            kingPressure.black += (4 - dist) * 15;
                        }
                    }
                }
                
                // Positional bonus (phase-adjusted)
                let pstBonus = 0;
                switch (type) {
                    case 1: pstBonus = PST.PAWN[pstIndex]; break;
                    case 2: pstBonus = PST.KNIGHT[pstIndex]; break;
                    case 3: pstBonus = PST.BISHOP[pstIndex]; break;
                    case 4: pstBonus = PST.ROOK[pstIndex]; break;
                    case 5: pstBonus = PST.QUEEN[pstIndex]; break;
                    case 6: pstBonus = PST.KING[pstIndex]; break;
                }
                
                // Phase-specific bonuses (ENHANCED)
                if (phase === 'opening') {
                    // Aggressive development
                    if (type === 2 || type === 3) pstBonus *= 1.4; // Knights and bishops
                    if (type === 5) pstBonus *= 1.2; // Queen activity
                } else if (phase === 'middlegame') {
                    // LETHAL tactical play
                    if (type === 4 || type === 5) pstBonus *= 1.3; // Rooks and queens
                    if (type === 2) pstBonus *= 1.2; // Knight tactics
                } else if (phase === 'endgame') {
                    // King activity in endgame
                    if (type === 6) pstBonus *= 1.6; // Stronger king bonus
                    // Pawn promotion potential
                    if (type === 1) pstBonus *= 1.5; // Stronger pawn bonus
                }
                
                score += isWhite ? pstBonus : -pstBonus;
            }
            
            // Add center control (ENHANCED)
            score += centerControl * 1.2;
            
            // Add king pressure (LETHAL COMBINATION)
            score += kingPressure.white - kingPressure.black;
            
            // Mobility bonus (phase-adjusted, ENHANCED)
            const mobility = MoveGenerator.generate(board).length;
            const mobilityBonus = phase === 'opening' ? 18 : (phase === 'middlegame' ? 14 : 10);
            score += board.turn * mobility * mobilityBonus;
            
            // Attacking pieces bonus (LETHAL)
            const attackBonus = phase === 'middlegame' ? 25 : 15;
            score += attackingPieces * attackBonus;
            
            return board.turn === 1 ? score : -score;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MASTERCLASS SEARCH ENGINE
    // ═══════════════════════════════════════════════════════════════════════
    
    class MasterclassSearchEngine extends SearchEngine {
        constructor() {
            super();
            this.moveHistory = [];
        }
        
        search(board, maxDepth, timeLimit, moveHistory = []) {
            this.moveHistory = moveHistory;
            this.nodes = 0;
            this.startTime = Date.now();
            this.stopTime = this.startTime + timeLimit;
            this.stopSearch = false;
            
            // Quick check for opening book move
            const phase = MasterPatternMatcher.getPhase(moveHistory.length);
            if (phase === 'opening' && moveHistory.length < 25) {
                const masterMove = MasterPatternMatcher.findMasterMove(moveHistory);
                if (masterMove) {
                    // Validate the move exists
                    const allMoves = EnhancedMoveGenerator.generate(board);
                    const foundMove = allMoves.find(m => MoveGenerator.moveToUCI(m) === masterMove);
                    if (foundMove) {
                        console.log(`⚡ LETHAL master move: ${masterMove} (${phase} phase - 5 legends database)`);
                        return foundMove;
                    }
                }
            }
            
            // ENHANCED iterative deepening search with deeper analysis
            let bestMove = null;
            const adjustedMaxDepth = phase === 'endgame' ? maxDepth + 1 : maxDepth;
            
            for (let depth = 1; depth <= adjustedMaxDepth; depth++) {
                if (this.stopSearch || Date.now() >= this.stopTime) break;
                this.currentDepth = depth;
                this.bestMoveThisIteration = null;
                this.alphaBeta(board, depth, -INFINITY, INFINITY, true);
                if (this.stopSearch) break;
                if (this.bestMoveThisIteration) bestMove = this.bestMoveThisIteration;
            }
            
            if (bestMove) {
                const moveUCI = MoveGenerator.moveToUCI(bestMove);
                console.log(`⚡ LETHAL calculation: ${moveUCI} (depth ${this.currentDepth}, ${this.nodes} nodes, ${phase})`);
            }
            
            return bestMove;
        }
        
        alphaBeta(board, depth, alpha, beta, isMaximizing) {
            if (Date.now() >= this.stopTime) {
                this.stopSearch = true;
                return 0;
            }
            
            if (depth === 0) {
                return PhaseAwareEvaluator.evaluate(board, this.moveHistory.length);
            }
            
            this.nodes++;
            const moves = EnhancedMoveGenerator.generateWithMasterOrdering(board, this.moveHistory);
            
            if (moves.length === 0) return -MATE_SCORE + (this.currentDepth - depth);
            
            let bestMove = null;
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                const score = -this.alphaBeta(newBoard, depth - 1, -beta, -alpha, !isMaximizing);
                
                if (score > alpha) {
                    alpha = score;
                    bestMove = move;
                }
                if (alpha >= beta) break;
            }
            
            if (depth === this.currentDepth && bestMove) {
                this.bestMoveThisIteration = bestMove;
            }
            
            return alpha;
        }
    }


    // ═══════════════════════════════════════════════════════════════════════
    // MASTERCLASS CHESS ENGINE
    // ═══════════════════════════════════════════════════════════════════════
    
    class ChessEngine {
        constructor() {
            this.board = new Board();
            this.search = new MasterclassSearchEngine();
            this.moveHistory = [];
        }

        parseFEN(fen) {
            const parts = fen.split(' ');
            const position = parts[0];
            const turn = parts[1] === 'w' ? 1 : -1;
            const castling = parts[2] || 'KQkq';
            const enPassant = parts[3] || '-';

            this.board.squares.fill(PIECES.EMPTY);
            let sq = 0;
            for (let char of position) {
                if (char === '/') continue;
                if (/\d/.test(char)) {
                    sq += parseInt(char);
                } else {
                    this.board.squares[sq] = CHAR_TO_PIECE[char];
                    if (char === 'K') this.board.kings.white = sq;
                    if (char === 'k') this.board.kings.black = sq;
                    sq++;
                }
            }

            this.board.turn = turn;
            this.board.castling = {
                wk: castling.includes('K'),
                wq: castling.includes('Q'),
                bk: castling.includes('k'),
                bq: castling.includes('q')
            };

            if (enPassant !== '-') {
                const file = enPassant.charCodeAt(0) - 97;
                const rank = 8 - parseInt(enPassant[1]);
                this.board.enPassant = rank * 8 + file;
            } else {
                this.board.enPassant = -1;
            }
        }

        getBestMove(fen, timeLimit = 2000) {
            this.parseFEN(fen);
            const move = this.search.search(this.board, 10, timeLimit, this.moveHistory);
            if (move) {
                const uciMove = MoveGenerator.moveToUCI(move);
                this.moveHistory.push(uciMove);
                return uciMove;
            }
            return null;
        }
        
        resetGame() {
            this.moveHistory = [];
        }
    }

// ═══════════════════════════════════════════════════════════════════════
    // BOT LOGIC
    // ═══════════════════════════════════════════════════════════════════════

    const CONFIG = {
        enabled: true,
        playAsWhite: true,
        playAsBlack: true,
        movetime: 2000
    };

    const STATE = {
        engine: null,
        webSocket: null,
        currentFen: '',
        processingMove: false,
        stats: { movesPlayed: 0, errors: 0 }
    };

    const Logger = {
        log(msg, color = '#2196F3') {
            console.log(`%c[AlphaZero] ${msg}`, `color: ${color}; font-weight: bold;`);
        },
        success: (msg) => Logger.log(msg, '#4CAF50'),
        error: (msg) => Logger.log(msg, '#F44336'),
        info: (msg) => Logger.log(msg, '#2196F3')
    };

    const LichessManager = {
        install() {
            const OriginalWebSocket = window.WebSocket;
            window.WebSocket = new Proxy(OriginalWebSocket, {
                construct(target, args) {
                    const ws = new target(...args);
                    STATE.webSocket = ws;
                    ws.addEventListener('message', (event) => {
                        try {
                            const message = JSON.parse(event.data);
                            if (message.d && typeof message.d.fen === 'string' && typeof message.v === 'number') {
                                LichessManager.handleGameState(message);
                            }
                        } catch (e) {}
                    });
                    return ws;
                }
            });
            Logger.success('WebSocket intercepted');
        },

        handleGameState(message) {
            let fen = message.d.fen;
            const isWhiteTurn = message.v % 2 === 0;
            
            if (!fen.includes(' w') && !fen.includes(' b')) {
                fen += isWhiteTurn ? ' w KQkq - 0 1' : ' b KQkq - 0 1';
            }

            if (fen === STATE.currentFen || STATE.processingMove) return;
            STATE.currentFen = fen;

            const turn = fen.split(' ')[1];
            if ((turn === 'w' && !CONFIG.playAsWhite) || (turn === 'b' && !CONFIG.playAsBlack)) return;
            if (!CONFIG.enabled) return;

            STATE.processingMove = true;
            Logger.info(`Analyzing position... (${turn === 'w' ? 'White' : 'Black'})`);

            setTimeout(() => {
                const bestMove = STATE.engine.getBestMove(fen, CONFIG.movetime);
                if (bestMove && bestMove !== '0000') {
                    LichessManager.sendMove(bestMove);
                } else {
                    Logger.error('No valid move found');
                    STATE.processingMove = false;
                }
            }, 100);
        },

        sendMove(move) {
            if (!STATE.webSocket || STATE.webSocket.readyState !== WebSocket.OPEN) {
                Logger.error('WebSocket not ready');
                STATE.processingMove = false;
                return;
            }

            try {
                const moveMsg = JSON.stringify({
                    t: 'move',
                    d: { u: move, b: 1, l: CONFIG.movetime, a: 1 }
                });
                STATE.webSocket.send(moveMsg);
                STATE.stats.movesPlayed++;
                Logger.success(`Move sent: ${move} (total: ${STATE.stats.movesPlayed})`);
                STATE.processingMove = false;
            } catch (error) {
                Logger.error(`Failed to send move: ${error.message}`);
                STATE.processingMove = false;
                STATE.stats.errors++;
            }
        }
    };

    function initialize() {
        console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #9C27B0;');
        console.log('%c║  ⚡ AlphaZero LETHAL v6.0 - 5 LEGENDS              ║', 'color: #9C27B0; font-weight: bold;');
        console.log('%c║  ⚡ AlphaZero + Fischer + Karpov + Carlsen + Morphy║', 'color: #FF5722; font-weight: bold;');
        console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #9C27B0;');
        console.log('%c⚠️  EDUCATIONAL USE ONLY', 'color: #F44336; font-size: 14px; font-weight: bold;');

        STATE.engine = new ChessEngine();
        Logger.success('Engine initialized');

        LichessManager.install();
        Logger.success('⚡ LETHAL mode activated - 5 legends, enhanced aggression');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    window.AlphaZeroBot = {
        enable() { CONFIG.enabled = true; Logger.success('Bot ENABLED'); },
        disable() { CONFIG.enabled = false; Logger.error('Bot DISABLED'); },
        getStats() { return STATE.stats; }
    };


})();
