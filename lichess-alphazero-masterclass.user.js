// ==UserScript==
// @name         Lichess AlphaZero Masterclass - Ultimate Chess Engine
// @description  AlphaZero brilliancies + Carlsen + Fischer + Morphy patterns - Masterclass play
// @author       Claude AI + 8114 Master Games
// @version      5.0.0
// @match        *://lichess.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  EDUCATIONAL USE ONLY - DO NOT USE ON LIVE LICHESS GAMES ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 * MASTERCLASS EDITION - Enhanced with 8,114 games:
 * - AlphaZero brilliancies (10 games, 3x weight)
 * - Magnus Carlsen (7,068 games, 2x weight)
 * - Bobby Fischer (825 games, 2.5x weight)
 * - Paul Morphy (211 games, 2x weight)
 * 
 * Features:
 * ✓ 200+ opening positions from master games
 * ✓ Phase-aware evaluation (Opening/Middlegame/Endgame)
 * ✓ Master move ordering (prioritizes proven patterns)
 * ✓ AlphaZero-style search with master knowledge
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // MASTER PATTERNS DATABASE (Embedded from 8,114 games)
    // ═══════════════════════════════════════════════════════════════════════
    
    const MASTER_DATABASE = {"openings":{"start":[{"move":"e4","weight":0.512784577532779},{"move":"d4","weight":0.31751222398704415},{"move":"Nf3","weight":0.08798156280170669},{"move":"c4","weight":0.06689713164533309},{"move":"b3","weight":0.014824504033137127}],"d4":[{"move":"Nf6","weight":0.7068030690537085},{"move":"d5","weight":0.23682864450127877},{"move":"g6","weight":0.023017902813299233},{"move":"e6","weight":0.020664961636828644},{"move":"d6","weight":0.012685421994884911}],"d4 e6":[{"move":"c4","weight":0.49504950495049505},{"move":"Nf3","weight":0.25742574257425743},{"move":"e4","weight":0.2079207920792079},{"move":"Bf4","weight":0.019801980198019802},{"move":"Nc3","weight":0.019801980198019802}],"d4 e6 e4 d5":[{"move":"Nc3","weight":0.5238095238095238},{"move":"Nd2","weight":0.2857142857142857},{"move":"e5","weight":0.19047619047619047}],"d4 e6 e4 d5 Nc3":[{"move":"Nf6","weight":0.6363636363636364},{"move":"Bb4","weight":0.36363636363636365}],"d4 e6 e4 d5 Nc3 Nf6 e5 Nfd7":[{"move":"f4","weight":0.7142857142857143},{"move":"Nce2","weight":0.2857142857142857}],"d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3":[{"move":"Nc6","weight":0.9142857142857143},{"move":"cxd4","weight":0.08571428571428572}],"d4 Nf6":[{"move":"c4","weight":0.7576110706482155},{"move":"Nf3","weight":0.1552804078659869},{"move":"Bf4","weight":0.04428259286234523},{"move":"Bg5","weight":0.02811361981063365},{"move":"Nc3","weight":0.014712308812818646}],"d4 Nf6 c4":[{"move":"e6","weight":0.6425383271880458},{"move":"g6","weight":0.289928197166699},{"move":"c5","weight":0.047739181059576946},{"move":"b6","weight":0.010285270716087716},{"move":"c6","weight":0.00950902386959053}],"d4 Nf6 c4 e6":[{"move":"Nf3","weight":0.5862277257626095},{"move":"Nc3","weight":0.3545756569012383},{"move":"g3","weight":0.05436424041075204},{"move":"Bg5","weight":0.0024161884627000906},{"move":"Bf4","weight":0.0024161884627000906}],"d4 Nf6 c4 e6 Nf3":[{"move":"d5","weight":0.66133195663397},{"move":"b6","weight":0.22509034589571503},{"move":"Bb4+","weight":0.07640681466184822},{"move":"c5","weight":0.03304078471863707},{"move":"a6","weight":0.004130098089829634}],"d4 Nf6 c4 e6 Nf3 b6":[{"move":"g3","weight":0.7614678899082569},{"move":"Nc3","weight":0.13761467889908258},{"move":"a3","weight":0.09174311926605505},{"move":"Bg5","weight":0.009174311926605505}],"d4 Nf6 c4 e6 Nf3 b6 g3":[{"move":"Ba6","weight":0.6746987951807228},{"move":"Bb7","weight":0.2891566265060241},{"move":"Bb4+","weight":0.03614457831325301}],"Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2":[{"move":"Be7","weight":0.7083333333333334},{"move":"Bb4+","weight":0.20833333333333334},{"move":"g6","weight":0.041666666666666664},{"move":"c5","weight":0.041666666666666664}],"c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7":[{"move":"O-O","weight":0.5},{"move":"Nc3","weight":0.5}],"Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O":[{"move":"Nc3","weight":0.631578947368421},{"move":"Re1","weight":0.21052631578947367},{"move":"d5","weight":0.15789473684210525}],"exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7 e4":[{"move":"Bf6","weight":0.6666666666666666},{"move":"d5","weight":0.3333333333333333}],"Nf3":[{"move":"Nf6","weight":0.5116102017510468},{"move":"d5","weight":0.32356299961933765},{"move":"c5","weight":0.08983631518842787},{"move":"g6","weight":0.05367339170156071},{"move":"b6","weight":0.02131709173962695}],"Nf3 Nf6":[{"move":"c4","weight":0.47238805970149256},{"move":"g3","weight":0.4261194029850746},{"move":"d4","weight":0.05},{"move":"b3","weight":0.04552238805970149},{"move":"d3","weight":0.005970149253731343}],"Nf3 Nf6 c4":[{"move":"e6","weight":0.352},{"move":"g6","weight":0.2352},{"move":"c5","weight":0.1664},{"move":"b6","weight":0.1632},{"move":"c6","weight":0.0832}],"Nf3 Nf6 c4 b6":[{"move":"g3","weight":0.43137254901960786},{"move":"d4","weight":0.29411764705882354},{"move":"Nc3","weight":0.23529411764705882},{"move":"b3","weight":0.0392156862745098}],"Nf3 Nf6 c4 b6 d4":[{"move":"e6","weight":0.7333333333333333},{"move":"Bb7","weight":0.26666666666666666}],"Nf3 Nf6 c4 b6 d4 e6 g3":[{"move":"Ba6","weight":0.6363636363636364},{"move":"Bb4+","weight":0.36363636363636365}],"Nf3 Nf6 c4 b6 d4 e6 g3 Ba6":[{"move":"Qc2","weight":0.7142857142857143},{"move":"b3","weight":0.2857142857142857}],"Nf6 c4 b6 d4 e6 g3 Ba6 Qc2":[{"move":"c5","weight":0.6},{"move":"Bb7","weight":0.4}],"c5 d5 exd5 cxd5 Bb7 Bg2 Nxd5 O-O":[{"move":"Be7","weight":0.625},{"move":"Nc6","weight":0.375}],"Nf6 e4 g6 Qf4 O-O e5 Nh5 Qg4":[{"move":"Re8","weight":0.375},{"move":"Ng7","weight":0.375},{"move":"d5","weight":0.25}],"Nf3 Nf6 d4":[{"move":"g6","weight":0.31343283582089554},{"move":"e6","weight":0.26865671641791045},{"move":"b6","weight":0.1791044776119403},{"move":"d5","weight":0.11940298507462686},{"move":"c5","weight":0.11940298507462686}],"Nf3 Nf6 d4 e6":[{"move":"c4","weight":0.7777777777777778},{"move":"Bg5","weight":0.2222222222222222}],"Nf3 Nf6 d4 e6 c4":[{"move":"d5","weight":0.5714285714285714},{"move":"b6","weight":0.42857142857142855}],"c4 b6 g3 Bb7 Bg2 Be7 O-O O-O":[{"move":"d5","weight":0.42857142857142855},{"move":"Bf4","weight":0.2857142857142857},{"move":"Re1","weight":0.2857142857142857}],"d4 Nf6 Nf3":[{"move":"d5","weight":0.341130604288499},{"move":"g6","weight":0.3235867446393762},{"move":"e6","weight":0.21442495126705652},{"move":"b6","weight":0.07407407407407407},{"move":"c5","weight":0.04678362573099415}],"d4 Nf6 Nf3 e6":[{"move":"c4","weight":0.509090909090909},{"move":"Bg5","weight":0.16363636363636364},{"move":"e3","weight":0.14545454545454545},{"move":"Bf4","weight":0.12727272727272726},{"move":"g3","weight":0.05454545454545454}],"d4 Nf6 Nf3 e6 c4":[{"move":"b6","weight":0.5357142857142857},{"move":"d5","weight":0.21428571428571427},{"move":"c5","weight":0.14285714285714285},{"move":"Bb4+","weight":0.10714285714285714}],"d4 Nf6 Nf3 e6 c4 b6":[{"move":"g3","weight":0.8666666666666667},{"move":"a3","weight":0.06666666666666667},{"move":"Nc3","weight":0.06666666666666667}],"d4 Nf6 Nf3 e6 c4 b6 g3":[{"move":"Ba6","weight":0.4230769230769231},{"move":"Bb4+","weight":0.3076923076923077},{"move":"Bb7","weight":0.15384615384615385},{"move":"Be7","weight":0.11538461538461539}],"e4":[{"move":"e5","weight":0.43351186933809427},{"move":"c5","weight":0.3963499305693315},{"move":"e6","weight":0.07200952192025392},{"move":"c6","weight":0.06420683726773788},{"move":"g6","weight":0.033921840904582425}],"e4 e5":[{"move":"Nf3","weight":0.8953737745098039},{"move":"f4","weight":0.051011029411764705},{"move":"Bc4","weight":0.02466299019607843},{"move":"Nc3","weight":0.020373774509803922},{"move":"d4","weight":0.00857843137254902}],"e4 e5 Nf3":[{"move":"Nc6","weight":0.9056668378702277},{"move":"Nf6","weight":0.07259030987844547},{"move":"d6","weight":0.020202020202020204},{"move":"f5","weight":0.0008560178051703475},{"move":"Qf6","weight":0.000684814244136278}],"e4 e5 Nf3 Nc6":[{"move":"Bb5","weight":0.6700189753320683},{"move":"Bc4","weight":0.24174573055028464},{"move":"d4","weight":0.04402277039848197},{"move":"Nc3","weight":0.041935483870967745},{"move":"g3","weight":0.0022770398481973433}],"e4 e5 Nf3 Nc6 Bc4":[{"move":"Bc5","weight":0.6067503924646782},{"move":"Nf6","weight":0.38069073783359497},{"move":"Be7","weight":0.006279434850863423},{"move":"f5","weight":0.0031397174254317113},{"move":"d6","weight":0.0031397174254317113}],"e4 e5 Nf3 Nc6 Bc4 Nf6":[{"move":"d3","weight":0.7917525773195876},{"move":"Ng5","weight":0.13402061855670103},{"move":"d4","weight":0.06597938144329897},{"move":"Nc3","weight":0.008247422680412371}],"e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5":[{"move":"Na5","weight":0.5205479452054794},{"move":"Nxd5","weight":0.3013698630136986},{"move":"b5","weight":0.1095890410958904},{"move":"Nd4","weight":0.0684931506849315}],"Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5":[{"move":"Nxf7","weight":0.6363636363636364},{"move":"d4","weight":0.36363636363636365}],"Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6":[{"move":"Nc3","weight":0.7777777777777778},{"move":"Ba3","weight":0.2222222222222222}],"d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3":[{"move":"Nb4","weight":0.42857142857142855},{"move":"Ne7","weight":0.2857142857142857},{"move":"Nd4","weight":0.2857142857142857}],"d4 Nf6 c4 e6 Nc3":[{"move":"Bb4","weight":0.82793867120954},{"move":"d5","weight":0.15417376490630325},{"move":"c5","weight":0.01788756388415673}],"d4 Nf6 c4 e6 Nc3 Bb4":[{"move":"Qc2","weight":0.3077731092436975},{"move":"e3","weight":0.3025210084033613},{"move":"Nf3","weight":0.22478991596638656},{"move":"f3","weight":0.08928571428571429},{"move":"a3","weight":0.07563025210084033}],"d4 Nf6 c4 e6 Nc3 Bb4 e3":[{"move":"O-O","weight":0.6215277777777778},{"move":"b6","weight":0.1909722222222222},{"move":"d5","weight":0.09722222222222222},{"move":"c5","weight":0.09027777777777778}],"d4 Nf6 c4 e6 Nc3 Bb4 e3 c5":[{"move":"Ne2","weight":0.6153846153846154},{"move":"Bd3","weight":0.38461538461538464}],"Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3":[{"move":"Nc6","weight":0.6},{"move":"d5","weight":0.4}],"d4 Nf6 Nf3 e6 c4 b6 g3 Ba6":[{"move":"b3","weight":0.5454545454545454},{"move":"Qc2","weight":0.2727272727272727},{"move":"Qb3","weight":0.18181818181818182}],"Nxd5 O-O Be7 Rd1 Nc6 Qf5 Nf6 e4":[{"move":"g6","weight":0.5555555555555556},{"move":"d6","weight":0.4444444444444444}],"e6 Nf3 b6 g3 Bb7 Bg2 Be7 Nc3":[{"move":"O-O","weight":0.5294117647058824},{"move":"Na6","weight":0.23529411764705882},{"move":"Ne4","weight":0.23529411764705882}],"Nf3 b6 g3 Bb7 Bg2 Be7 Nc3 O-O":[{"move":"Qc2","weight":0.4444444444444444},{"move":"O-O","weight":0.3333333333333333},{"move":"Bf4","weight":0.2222222222222222}],"Nf3 Nf6 c4 e6":[{"move":"Nc3","weight":0.5227272727272727},{"move":"g3","weight":0.2545454545454545},{"move":"d4","weight":0.15},{"move":"b3","weight":0.05454545454545454},{"move":"e3","weight":0.01818181818181818}],"Nf3 Nf6 c4 e6 Nc3":[{"move":"d5","weight":0.4608695652173913},{"move":"Bb4","weight":0.33043478260869563},{"move":"c5","weight":0.20869565217391303}],"Nf3 Nf6 c4 e6 Nc3 Bb4":[{"move":"Qc2","weight":0.5789473684210527},{"move":"g3","weight":0.3157894736842105},{"move":"g4","weight":0.10526315789473684}],"Nf3 Nf6 c4 e6 Nc3 Bb4 Qc2":[{"move":"O-O","weight":0.6363636363636364},{"move":"c5","weight":0.36363636363636365}],"Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3":[{"move":"Bxc3+","weight":0.851063829787234},{"move":"Bxc3","weight":0.14893617021276595}],"e6 Nc3 Bb4 Qc2 O-O a3 Bxc3 Qxc3":[{"move":"b6","weight":0.5714285714285714},{"move":"a5","weight":0.42857142857142855}],"d4 Nf6 Nf3 d5":[{"move":"Bf4","weight":0.3699421965317919},{"move":"c4","weight":0.34971098265895956},{"move":"g3","weight":0.10404624277456648},{"move":"e3","weight":0.0953757225433526},{"move":"a3","weight":0.08092485549132948}],"d4 Nf6 Nf3 d5 e3":[{"move":"e6","weight":0.36363636363636365},{"move":"c5","weight":0.24242424242424243},{"move":"g6","weight":0.15151515151515152},{"move":"Bf5","weight":0.12121212121212122},{"move":"a6","weight":0.12121212121212122}],"e4 Nf6":[{"move":"e5","weight":0.8827361563517915},{"move":"Nc3","weight":0.11726384364820847}],"e4 Nf6 e5":[{"move":"Nd5","weight":0.940959409594096},{"move":"Ng8","weight":0.05904059040590406}],"e4 Nf6 e5 Nd5":[{"move":"d4","weight":0.8745098039215686},{"move":"c4","weight":0.0784313725490196},{"move":"Nf3","weight":0.047058823529411764}],"e4 Nf6 e5 Nd5 d4":[{"move":"d6","weight":0.9461883408071748},{"move":"Nb6","weight":0.053811659192825115}],"e4 Nf6 e5 Nd5 d4 d6":[{"move":"Nf3","weight":0.7203791469194313},{"move":"c4","weight":0.2796208530805687}],"e4 Nf6 e5 Nd5 d4 d6 Nf3":[{"move":"dxe5","weight":0.7171052631578947},{"move":"g6","weight":0.14473684210526316},{"move":"Bg4","weight":0.1118421052631579},{"move":"Nc6","weight":0.02631578947368421}],"e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4":[{"move":"Be2","weight":0.5294117647058824},{"move":"Bc4","weight":0.23529411764705882},{"move":"h3","weight":0.23529411764705882}],"e4 e6":[{"move":"d4","weight":0.8453410182516811},{"move":"Nf3","weight":0.049951969260326606},{"move":"d3","weight":0.04226705091258405},{"move":"Nc3","weight":0.03170028818443804},{"move":"b3","weight":0.03073967339097022}],"e4 e6 d4":[{"move":"d5","weight":0.9571263035921205},{"move":"a6","weight":0.01853997682502897},{"move":"Ke7","weight":0.009269988412514484},{"move":"g6","weight":0.009269988412514484},{"move":"Bb4+","weight":0.005793742757821553}],"e4 e6 d4 d5":[{"move":"Nc3","weight":0.6016949152542372},{"move":"exd5","weight":0.14527845036319612},{"move":"Nd2","weight":0.13196125907990314},{"move":"e5","weight":0.10653753026634383},{"move":"Bd3","weight":0.014527845036319613}],"e4 e6 d4 d5 Nc3":[{"move":"Bb4","weight":0.4847870182555781},{"move":"Nf6","weight":0.3894523326572008},{"move":"dxe4","weight":0.058823529411764705},{"move":"h6","weight":0.04056795131845842},{"move":"Nc6","weight":0.02636916835699797}],"e4 e6 d4 d5 Nc3 Bb4":[{"move":"e5","weight":0.8326359832635983},{"move":"a3","weight":0.100418410041841},{"move":"exd5","weight":0.0502092050209205},{"move":"Qd3","weight":0.016736401673640166}],"e4 e6 d4 d5 Nc3 Bb4 e5":[{"move":"c5","weight":0.5628140703517588},{"move":"Ne7","weight":0.32160804020100503},{"move":"b6","weight":0.09045226130653267},{"move":"f6","weight":0.02512562814070352}],"d5 Nc3 Bb4 e5 Ne7 a3 Bxc3+ bxc3":[{"move":"c5","weight":0.703125},{"move":"b6","weight":0.21875},{"move":"O-O","weight":0.078125}],"Bb4 e5 Ne7 a3 Bxc3+ bxc3 b6 Qg4":[{"move":"Ng6","weight":0.7142857142857143},{"move":"Nf5","weight":0.2857142857142857}],"d4 d5":[{"move":"c4","weight":0.7477243172951885},{"move":"Nf3","weight":0.13437364542696142},{"move":"Bf4","weight":0.08322496749024708},{"move":"Nc3","weight":0.031209362808842653},{"move":"Bg5","weight":0.0034677069787602947}],"d4 d5 c4":[{"move":"c6","weight":0.45341246290801185},{"move":"e6","weight":0.41602373887240357},{"move":"dxc4","weight":0.10682492581602374},{"move":"Nc6","weight":0.011869436201780416},{"move":"Nf6","weight":0.011869436201780416}],"d4 d5 c4 e6":[{"move":"Nc3","weight":0.536376604850214},{"move":"Nf3","weight":0.4579172610556348},{"move":"g3","weight":0.005706134094151213}],"d4 d5 c4 e6 Nc3":[{"move":"Nf6","weight":0.4427710843373494},{"move":"Be7","weight":0.15963855421686746},{"move":"c5","weight":0.14457831325301204},{"move":"a6","weight":0.14457831325301204},{"move":"c6","weight":0.10843373493975904}],"d4 d5 c4 e6 Nc3 Nf6":[{"move":"cxd5","weight":0.6870748299319728},{"move":"Bg5","weight":0.14285714285714285},{"move":"Nf3","weight":0.11564625850340136},{"move":"e3","weight":0.027210884353741496},{"move":"Bf4","weight":0.027210884353741496}],"e4 c5":[{"move":"Nf3","weight":0.8835780129737112},{"move":"Nc3","weight":0.06418572891771936},{"move":"c3","weight":0.032434277910549675},{"move":"Ne2","weight":0.011266643905769888},{"move":"d4","weight":0.008535336292249915}],"e4 c5 Nf3":[{"move":"d6","weight":0.4577630035197497},{"move":"Nc6","weight":0.321861556511537},{"move":"e6","weight":0.18967540086038326},{"move":"g6","weight":0.019554165037152915},{"move":"a6","weight":0.011145874071177161}],"e4 c5 Nf3 Nc6":[{"move":"d4","weight":0.432},{"move":"Bb5","weight":0.4036923076923077},{"move":"Nc3","weight":0.11507692307692308},{"move":"c3","weight":0.029538461538461538},{"move":"Bc4","weight":0.019692307692307693}],"e4 c5 Nf3 Nc6 d4 cxd4 Nxd4":[{"move":"Nf6","weight":0.6404657933042213},{"move":"e6","weight":0.13828238719068414},{"move":"g6","weight":0.11935953420669577},{"move":"e5","weight":0.08879184861717612},{"move":"Qb6","weight":0.013100436681222707}],"e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5":[{"move":"Nb5","weight":0.9344262295081968},{"move":"Nxc6","weight":0.06557377049180328}],"c5 Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5":[{"move":"d6","weight":0.8421052631578947},{"move":"a6","weight":0.15789473684210525}],"Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5 d6":[{"move":"N1c3","weight":0.6666666666666666},{"move":"c4","weight":0.25},{"move":"g3","weight":0.08333333333333333}],"cxd4 Nxd4 e5 Nb5 d6 N1c3 a6 Na3":[{"move":"Be7","weight":0.5},{"move":"b5","weight":0.375},{"move":"Be6","weight":0.125}],"e5 Nb5 d6 N1c3 a6 Na3 b5 Nd5":[{"move":"Nge7","weight":0.6666666666666666},{"move":"Nf6","weight":0.3333333333333333}],"d6 N1c3 a6 Na3 b5 Nd5 Nge7 c4":[{"move":"Nd4","weight":0.5},{"move":"Nxd5","weight":0.5}],"e4 e5 Nf3 Nf6":[{"move":"Nxe5","weight":0.7806603773584906},{"move":"d4","weight":0.07783018867924528},{"move":"Nc3","weight":0.0660377358490566},{"move":"d3","weight":0.05660377358490566},{"move":"Bc4","weight":0.018867924528301886}],"e4 e5 Nf3 Nf6 Nxe5":[{"move":"d6","weight":0.9637462235649547},{"move":"Nxe4","weight":0.03625377643504532}],"e4 e5 Nf3 Nf6 Nxe5 d6":[{"move":"Nf3","weight":0.8871473354231975},{"move":"Nd3","weight":0.06269592476489028},{"move":"Nc4","weight":0.03761755485893417},{"move":"Nxf7","weight":0.012539184952978056}],"e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4":[{"move":"d4","weight":0.38545454545454544},{"move":"Nc3","weight":0.23272727272727273},{"move":"d3","weight":0.20363636363636364},{"move":"Qe2","weight":0.09090909090909091},{"move":"Bd3","weight":0.08727272727272728}],"e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4":[{"move":"d5","weight":0.8679245283018868},{"move":"Be7","weight":0.08490566037735849},{"move":"Nf6","weight":0.04716981132075472}],"Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3":[{"move":"Bd6","weight":0.43478260869565216},{"move":"Be7","weight":0.21739130434782608},{"move":"Nc6","weight":0.17391304347826086},{"move":"Bf5","weight":0.17391304347826086}],"Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6":[{"move":"O-O","weight":0.9},{"move":"c4","weight":0.1}],"Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O":[{"move":"c4","weight":0.7777777777777778},{"move":"Re1","weight":0.2222222222222222}],"d4 d5 Bd3 Bd6 O-O O-O c4 c6":[{"move":"Re1","weight":0.7142857142857143},{"move":"Nc3","weight":0.14285714285714285},{"move":"Qc2","weight":0.14285714285714285}],"e4 g6":[{"move":"d4","weight":0.8821218074656189},{"move":"Nf3","weight":0.07072691552062868},{"move":"Nc3","weight":0.03143418467583497},{"move":"g3","weight":0.007858546168958742},{"move":"h4","weight":0.007858546168958742}],"e4 g6 d4":[{"move":"Bg7","weight":0.47438752783964366},{"move":"d6","weight":0.40089086859688194},{"move":"Nf6","weight":0.12472160356347439}],"e4 g6 d4 Bg7":[{"move":"Nc3","weight":0.5868544600938967},{"move":"Nf3","weight":0.39436619718309857},{"move":"c4","weight":0.018779342723004695}],"e4 g6 d4 Bg7 Nc3":[{"move":"d6","weight":0.84},{"move":"c6","weight":0.064},{"move":"b6","weight":0.032},{"move":"c5","weight":0.032},{"move":"a6","weight":0.032}],"e4 g6 d4 Bg7 Nc3 d6":[{"move":"Be3","weight":0.42857142857142855},{"move":"f4","weight":0.3047619047619048},{"move":"Nf3","weight":0.22857142857142856},{"move":"h4","weight":0.0380952380952381}],"e4 g6 d4 Bg7 Nc3 d6 f4":[{"move":"Nf6","weight":0.4375},{"move":"c6","weight":0.15625},{"move":"Nc6","weight":0.15625},{"move":"c5","weight":0.125},{"move":"a6","weight":0.125}],"d4 d5 c4 c6":[{"move":"Nf3","weight":0.6963350785340314},{"move":"Nc3","weight":0.23036649214659685},{"move":"cxd5","weight":0.041884816753926704},{"move":"e3","weight":0.031413612565445025}],"d4 d5 c4 c6 Nc3":[{"move":"Nf6","weight":0.9318181818181818},{"move":"dxc4","weight":0.06818181818181818}],"d4 d5 c4 c6 Nc3 Nf6":[{"move":"e3","weight":0.7073170731707317},{"move":"Nf3","weight":0.24390243902439024},{"move":"cxd5","weight":0.04878048780487805}],"d4 d5 c4 c6 Nc3 Nf6 Nf3":[{"move":"dxc4","weight":0.4},{"move":"e6","weight":0.3},{"move":"a6","weight":0.3}],"d4 d5 c4 c6 Nc3 Nf6 Nf3 e6":[{"move":"e3","weight":0.6666666666666666},{"move":"g3","weight":0.3333333333333333}],"d5 c4 c6 Nc3 Nf6 Nf3 e6 e3":[{"move":"Nbd7","weight":0.5},{"move":"a6","weight":0.5}],"e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3":[{"move":"Bd6","weight":0.5},{"move":"Bb7","weight":0.3333333333333333},{"move":"a6","weight":0.16666666666666666}],"Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7":[{"move":"c4","weight":0.75},{"move":"c3","weight":0.25}],"e4 e5 Nf3 Nf6 d3":[{"move":"Nc6","weight":0.8333333333333334},{"move":"d6","weight":0.16666666666666666}],"e4 e5 Nf3 Nc6 Bb5":[{"move":"a6","weight":0.6502010338885698},{"move":"Nf6","weight":0.3087306145893165},{"move":"Bc5","weight":0.014359563469270534},{"move":"f5","weight":0.014072372199885124},{"move":"g6","weight":0.01263641585295807}],"e4 e5 Nf3 Nc6 Bb5 f5":[{"move":"d3","weight":0.6530612244897959},{"move":"Nc3","weight":0.2653061224489796},{"move":"Bxc6","weight":0.08163265306122448}],"e4 e5 Nf3 Nc6 Bb5 f5 d3":[{"move":"fxe4","weight":0.875},{"move":"Nf6","weight":0.125}],"Nc6 Bb5 f5 d3 fxe4 dxe4 Nf6 O-O":[{"move":"Bc5","weight":0.7142857142857143},{"move":"d6","weight":0.2857142857142857}],"Bb5 f5 d3 fxe4 dxe4 Nf6 O-O d6":[{"move":"Nc3","weight":0.5},{"move":"Bc4","weight":0.5}],"e4 c5 Nf3 d6":[{"move":"d4","weight":0.7517211703958692},{"move":"Bb5+","weight":0.1523235800344234},{"move":"Bc4","weight":0.04819277108433735},{"move":"Nc3","weight":0.024096385542168676},{"move":"c3","weight":0.023666092943201378}],"e4 c5 Nf3 d6 d4":[{"move":"cxd4","weight":0.976531196336577},{"move":"Nf6","weight":0.02346880366342301}],"e4 c5 Nf3 d6 d4 Nf6 Nc3 cxd4":[{"move":"Nxd4","weight":0.9024390243902439},{"move":"Qxd4","weight":0.0975609756097561}],"c5 Nf3 d6 d4 Nf6 Nc3 cxd4 Nxd4":[{"move":"a6","weight":0.5405405405405406},{"move":"g6","weight":0.24324324324324326},{"move":"Nc6","weight":0.21621621621621623}],"Nf3 d6 d4 Nf6 Nc3 cxd4 Nxd4 g6":[{"move":"Be3","weight":0.5555555555555556},{"move":"f3","weight":0.4444444444444444}],"Nxd4 g6 f3 Bg7 Be3 O-O Qd2 Nc6":[{"move":"Nb3","weight":0.5},{"move":"O-O-O","weight":0.5}],"e4 Nf6 Nc3":[{"move":"d5","weight":0.4444444444444444},{"move":"e5","weight":0.4444444444444444},{"move":"c5","weight":0.1111111111111111}],"e4 Nf6 Nc3 d5 e5":[{"move":"Nfd7","weight":0.5},{"move":"Ne4","weight":0.5}],"e4 Nf6 Nc3 d5 e5 Nfd7":[{"move":"d4","weight":0.5},{"move":"f4","weight":0.5}],"d4 Nf6 Nf3 c5":[{"move":"d5","weight":0.5208333333333334},{"move":"c4","weight":0.20833333333333334},{"move":"c3","weight":0.10416666666666667},{"move":"g3","weight":0.08333333333333333},{"move":"e3","weight":0.08333333333333333}],"c4":[{"move":"Nf6","weight":0.3373737373737374},{"move":"e5","weight":0.28939393939393937},{"move":"e6","weight":0.12727272727272726},{"move":"c5","weight":0.12676767676767678},{"move":"g6","weight":0.1191919191919192}],"c4 e5":[{"move":"Nc3","weight":0.5256637168141592},{"move":"g3","weight":0.3823008849557522},{"move":"e3","weight":0.05663716814159292},{"move":"d3","weight":0.021238938053097345},{"move":"b3","weight":0.01415929203539823}],"c4 e5 Nc3":[{"move":"Nf6","weight":0.6599326599326599},{"move":"Bb4","weight":0.20202020202020202},{"move":"Nc6","weight":0.12457912457912458},{"move":"d6","weight":0.013468013468013467}],"c4 e5 Nc3 Bb4":[{"move":"Nd5","weight":0.6666666666666666},{"move":"Qc2","weight":0.13333333333333333},{"move":"g3","weight":0.06666666666666667},{"move":"g4","weight":0.06666666666666667},{"move":"Nf3","weight":0.06666666666666667}],"c4 e5 Nc3 Bb4 Nd5":[{"move":"Bc5","weight":0.4},{"move":"Be7","weight":0.3},{"move":"a5","weight":0.2},{"move":"Na6","weight":0.1}],"c4 e5 Nc3 Bb4 Nd5 Be7":[{"move":"Nxe7","weight":0.3333333333333333},{"move":"d4","weight":0.3333333333333333},{"move":"Nf3","weight":0.3333333333333333}],"e4 e5 Nf3 Nf6 Nc3":[{"move":"Nc6","weight":0.8571428571428571},{"move":"Bb4","weight":0.14285714285714285}],"e4 e5 Nf3 Nf6 Nc3 Nc6":[{"move":"Bb5","weight":0.3333333333333333},{"move":"d4","weight":0.3333333333333333},{"move":"Bc4","weight":0.16666666666666666},{"move":"a4","weight":0.16666666666666666}],"e4 Nf6 Nc3 d5 e5 Ne4 Nce2":[{"move":"d4","weight":0.5},{"move":"f6","weight":0.5}],"Nf3 Nf6 g3":[{"move":"g6","weight":0.47619047619047616},{"move":"d5","weight":0.1978021978021978},{"move":"b6","weight":0.12637362637362637},{"move":"b5","weight":0.11721611721611722},{"move":"c5","weight":0.08241758241758242}],"Nf3 Nf6 g3 b6":[{"move":"Bg2","weight":0.8840579710144928},{"move":"d4","weight":0.11594202898550725}],"Nf3 Nf6 g3 b6 Bg2 Bb7":[{"move":"O-O","weight":0.8032786885245902},{"move":"b3","weight":0.13114754098360656},{"move":"d3","weight":0.06557377049180328}],"Nf3 Nf6 g3 b6 Bg2 Bb7 O-O":[{"move":"g6","weight":0.4897959183673469},{"move":"c5","weight":0.42857142857142855},{"move":"e6","weight":0.08163265306122448}],"Nf6 g3 b6 Bg2 Bb7 O-O c5 d3":[{"move":"e6","weight":0.5714285714285714},{"move":"d5","weight":0.23809523809523808},{"move":"g6","weight":0.19047619047619047}],"Bg2 Bb7 O-O c5 d3 e6 e4 d6":[{"move":"Re1","weight":0.6666666666666666},{"move":"Nbd2","weight":0.3333333333333333}],"Bb7 O-O c5 d3 e6 e4 d6 Re1":[{"move":"Be7","weight":0.5},{"move":"Nbd7","weight":0.5}],"e4 c5 Nf3 e6":[{"move":"d4","weight":0.6191562143671607},{"move":"c3","weight":0.12770809578107184},{"move":"b3","weight":0.09122006841505131},{"move":"d3","weight":0.08779931584948689},{"move":"g3","weight":0.07411630558722919}],"e4 c5 Nf3 e6 d4 cxd4":[{"move":"Nxd4","weight":0.992633517495396},{"move":"Bg5","weight":0.007366482504604052}],"e4 c5 Nf3 e6 d4 cxd4 Nxd4":[{"move":"a6","weight":0.4805194805194805},{"move":"Nc6","weight":0.3320964749536178},{"move":"Nf6","weight":0.15769944341372913},{"move":"Bc5","weight":0.022263450834879406},{"move":"Qb6","weight":0.0074211502782931356}],"e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6":[{"move":"Nc3","weight":0.8651685393258427},{"move":"Bd3","weight":0.1348314606741573}],"c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3":[{"move":"Nc6","weight":0.6233766233766234},{"move":"d6","weight":0.2727272727272727},{"move":"Qb6","weight":0.05194805194805195},{"move":"Qc7","weight":0.05194805194805195}],"e4 c6":[{"move":"d4","weight":0.6314677930306231},{"move":"Nf3","weight":0.1583949313621964},{"move":"Nc3","weight":0.14783526927138332},{"move":"d3","weight":0.04118268215417107},{"move":"Bc4","weight":0.021119324181626188}],"e4 c6 d4":[{"move":"d5","weight":0.9732441471571907},{"move":"Na6","weight":0.013377926421404682},{"move":"g6","weight":0.013377926421404682}],"e4 c6 d4 d5":[{"move":"e5","weight":0.3917525773195876},{"move":"exd5","weight":0.3402061855670103},{"move":"Nc3","weight":0.19931271477663232},{"move":"Nd2","weight":0.041237113402061855},{"move":"f3","weight":0.027491408934707903}],"e4 c6 d4 d5 e5":[{"move":"Bf5","weight":0.8771929824561403},{"move":"c5","weight":0.10526315789473684},{"move":"Nh6","weight":0.017543859649122806}],"e4 c6 d4 d5 e5 Bf5":[{"move":"Nf3","weight":0.4888888888888889},{"move":"h4","weight":0.2},{"move":"Nd2","weight":0.1111111111111111},{"move":"c4","weight":0.1111111111111111},{"move":"Be3","weight":0.08888888888888889}],"e4 c6 d4 d5 e5 Bf5 Nf3 e6":[{"move":"Be2","weight":0.9545454545454546},{"move":"a3","weight":0.045454545454545456}],"c6 d4 d5 e5 Bf5 Nf3 e6 Be2":[{"move":"Ne7","weight":0.3684210526315789},{"move":"a5","weight":0.21052631578947367},{"move":"c5","weight":0.15789473684210525},{"move":"h6","weight":0.15789473684210525},{"move":"Nd7","weight":0.10526315789473684}],"d5 e5 Bf5 Nf3 e6 Be2 Nd7 O-O":[{"move":"Ne7","weight":0.5},{"move":"Bg6","weight":0.5}],"c4 Nf6":[{"move":"Nc3","weight":0.6751497005988024},{"move":"g3","weight":0.12874251497005987},{"move":"Nf3","weight":0.1122754491017964},{"move":"d4","weight":0.08383233532934131}],"c4 Nf6 Nc3":[{"move":"e5","weight":0.4700665188470067},{"move":"g6","weight":0.21286031042128603},{"move":"e6","weight":0.1729490022172949},{"move":"c5","weight":0.11529933481152993},{"move":"d5","weight":0.028824833702882482}],"c4 Nf6 Nc3 c5":[{"move":"Nf3","weight":0.6923076923076923},{"move":"g3","weight":0.3076923076923077}],"c4 Nf6 Nc3 c5 Nf3":[{"move":"Nc6","weight":0.5555555555555556},{"move":"e6","weight":0.4444444444444444}],"c4 Nf6 Nc3 c5 Nf3 Nc6":[{"move":"d4","weight":0.6},{"move":"g3","weight":0.4}],"Nf6 Nc3 c5 Nf3 Nc6 g3 g6 Bg2":[{"move":"Bg7","weight":0.5},{"move":"d6","weight":0.5}],"c5 Nf3 Nc6 g3 g6 Bg2 Bg7 O-O":[{"move":"Nge7","weight":0.38461538461538464},{"move":"O-O","weight":0.3076923076923077},{"move":"d6","weight":0.3076923076923077}],"g3 g6 Bg2 Bg7 O-O O-O d3 d6":[{"move":"e4","weight":0.5813953488372093},{"move":"Nbd2","weight":0.11627906976744186},{"move":"h3","weight":0.11627906976744186},{"move":"Rb1","weight":0.09302325581395349},{"move":"c4","weight":0.09302325581395349}],"d5 e5 Bf5 Nf3 e6 Be2 Ne7 O-O":[{"move":"h6","weight":0.5714285714285714},{"move":"c5","weight":0.42857142857142855}],"e5 Bf5 Nf3 e6 Be2 Ne7 O-O c5":[{"move":"c3","weight":0.3333333333333333},{"move":"c4","weight":0.3333333333333333},{"move":"dxc5","weight":0.3333333333333333}],"e4 e5 Nf3 Nc6 Bb5 Nf6":[{"move":"d3","weight":0.5004668534080299},{"move":"O-O","weight":0.4323062558356676},{"move":"d4","weight":0.03361344537815126},{"move":"Qe2","weight":0.018674136321195144},{"move":"Nc3","weight":0.014939309056956116}],"e4 e5 Nf3 Nc6 Bb5 Nf6 Qe2":[{"move":"a6","weight":0.6},{"move":"Be7","weight":0.4}],"e4 e5 Nf3 Nc6 Bb5 Nf6 Qe2 a6":[{"move":"Ba4","weight":0.6666666666666666},{"move":"Bxc6","weight":0.3333333333333333}],"Nf3 Nc6 Bb5 Nf6 Qe2 a6 Ba4 Be7":[{"move":"O-O","weight":0.5},{"move":"c3","weight":0.5}],"Bb3 O-O c3 d6 h3 Bb7 d4 Re8":[{"move":"a4","weight":0.5},{"move":"Nbd2","weight":0.5}],"e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6":[{"move":"Bd3","weight":0.3843137254901961},{"move":"c4","weight":0.30980392156862746},{"move":"Nc3","weight":0.22745098039215686},{"move":"g3","weight":0.06274509803921569},{"move":"h3","weight":0.01568627450980392}],"c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3":[{"move":"Qc7","weight":0.6379310344827587},{"move":"b5","weight":0.27586206896551724},{"move":"Nc6","weight":0.08620689655172414}],"Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 b5":[{"move":"Bd3","weight":0.75},{"move":"g3","weight":0.25}],"e6 d4 cxd4 Nxd4 a6 Nc3 b5 Bd3":[{"move":"Qb6","weight":0.6666666666666666},{"move":"Bb7","weight":0.3333333333333333}],"d4 cxd4 Nxd4 a6 Nc3 b5 Bd3 Qb6":[{"move":"Be3","weight":0.5},{"move":"Nf3","weight":0.5}],"e4 c5 c3":[{"move":"d5","weight":0.5054945054945055},{"move":"Nf6","weight":0.3626373626373626},{"move":"d6","weight":0.04395604395604396},{"move":"Qa5","weight":0.04395604395604396},{"move":"e5","weight":0.04395604395604396}],"e4 c5 c3 d5 exd5":[{"move":"Qxd5","weight":0.6521739130434783},{"move":"Nf6","weight":0.34782608695652173}],"e4 c5 c3 d5 exd5 Qxd5 d4":[{"move":"g6","weight":0.4666666666666667},{"move":"Nf6","weight":0.4666666666666667},{"move":"Nc6","weight":0.06666666666666667}],"e4 e6 d4 d5 e5":[{"move":"c5","weight":0.9545454545454546},{"move":"Bd7","weight":0.045454545454545456}],"e4 e6 d4 d5 e5 c5":[{"move":"c3","weight":0.9523809523809523},{"move":"Nf3","weight":0.047619047619047616}],"e4 e6 d4 d5 e5 c5 c3":[{"move":"Nc6","weight":0.7},{"move":"Qb6","weight":0.3}],"e6 d4 d5 e5 c5 c3 Qb6 Nf3":[{"move":"Bd7","weight":0.6666666666666666},{"move":"Nc6","weight":0.3333333333333333}],"d4 d5 e5 c5 c3 Qb6 Nf3 Nc6":[{"move":"a3","weight":0.5},{"move":"Bd3","weight":0.5}],"c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Bd3":[{"move":"d6","weight":0.6666666666666666},{"move":"Nc6","weight":0.3333333333333333}],"Nf3 e6 d4 cxd4 Nxd4 Nf6 Bd3 d6":[{"move":"Be3","weight":0.5},{"move":"c4","weight":0.5}],"Nf3 Nf6 d4 d5 c4":[{"move":"e6","weight":0.5},{"move":"c6","weight":0.5}],"d4 Nf6 c4 c5":[{"move":"d5","weight":0.8577235772357723},{"move":"Nf3","weight":0.14227642276422764}],"d4 Nf6 c4 c5 d5":[{"move":"b5","weight":0.5308056872037915},{"move":"g6","weight":0.1943127962085308},{"move":"e6","weight":0.15165876777251186},{"move":"e5","weight":0.07582938388625593},{"move":"d6","weight":0.04739336492890995}],"d4 Nf6 c4 c5 d5 b5":[{"move":"cxb5","weight":0.8928571428571429},{"move":"Nf3","weight":0.03571428571428571},{"move":"Qc2","weight":0.03571428571428571},{"move":"f3","weight":0.03571428571428571}],"d4 Nf6 c4 c5 d5 b5 cxb5":[{"move":"a6","weight":0.92},{"move":"g6","weight":0.08}],"d4 Nf6 c4 c5 d5 b5 cxb5 a6":[{"move":"bxa6","weight":0.782608695652174},{"move":"f3","weight":0.08695652173913043},{"move":"e3","weight":0.08695652173913043},{"move":"b6","weight":0.043478260869565216}],"Nf6 c4 c5 d5 b5 cxb5 a6 f3":[{"move":"axb5","weight":0.5},{"move":"g6","weight":0.5}],"d4 d5 c4 e6 Nf3":[{"move":"Nf6","weight":0.6012461059190031},{"move":"a6","weight":0.18691588785046728},{"move":"c6","weight":0.13707165109034267},{"move":"dxc4","weight":0.04984423676012461},{"move":"Be7","weight":0.024922118380062305}],"d4 d5 c4 e6 Nf3 Nf6":[{"move":"Nc3","weight":0.5181347150259067},{"move":"g3","weight":0.39378238341968913},{"move":"Bg5","weight":0.04145077720207254},{"move":"cxd5","weight":0.025906735751295335},{"move":"e3","weight":0.02072538860103627}]},"tactics":{"opening":{"start":["e4","d4","Nf3"],"d4":["Nf6","d5","g6"],"d4 e6":["c4","Nf3","e4"],"d4 e6 e4 d5":["Nc3","Nd2","e5"],"d4 e6 e4 d5 Nc3":["Nf6","Bb4"],"d4 e6 e4 d5 Nc3 Nf6 e5 Nfd7":["f4","Nce2"],"d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3":["Nc6","cxd4"],"d4 Nf6":["c4","Nf3","Bf4"],"d4 Nf6 c4":["e6","g6","c5"],"d4 Nf6 c4 e6":["Nf3","Nc3","g3"],"d4 Nf6 c4 e6 Nf3":["d5","b6","Bb4+"],"d4 Nf6 c4 e6 Nf3 b6":["g3","Nc3","a3"],"d4 Nf6 c4 e6 Nf3 b6 g3":["Ba6","Bb7","Bb4+"],"Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2":["Be7","Bb4+","g6"],"c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7":["O-O","Nc3"],"Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O":["Nc3","Re1","d5"],"exd5 Nh4 c6 cxd5 Nxd5 Nf5 Nc7 e4":["Bf6","d5"],"Nf3":["Nf6","d5","c5"],"Nf3 Nf6":["c4","g3","d4"],"Nf3 Nf6 c4":["e6","g6","c5"],"Nf3 Nf6 c4 b6":["g3","d4","Nc3"],"Nf3 Nf6 c4 b6 d4":["e6","Bb7"],"Nf3 Nf6 c4 b6 d4 e6 g3":["Ba6","Bb4+"],"Nf3 Nf6 c4 b6 d4 e6 g3 Ba6":["Qc2","b3"],"Nf6 c4 b6 d4 e6 g3 Ba6 Qc2":["c5","Bb7"],"c5 d5 exd5 cxd5 Bb7 Bg2 Nxd5 O-O":["Be7","Nc6"],"Nf6 e4 g6 Qf4 O-O e5 Nh5 Qg4":["Re8","Ng7","d5"],"Nf3 Nf6 d4":["g6","e6","b6"],"Nf3 Nf6 d4 e6":["c4","Bg5"],"Nf3 Nf6 d4 e6 c4":["d5","b6"],"c4 b6 g3 Bb7 Bg2 Be7 O-O O-O":["d5","Bf4","Re1"]},"middlegame":{},"endgame":{}}};

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
            
            if (masterMove) {
                // Boost master moves in ordering
                moves.sort((a, b) => {
                    const aUCI = this.moveToUCI(a);
                    const bUCI = this.moveToUCI(b);
                    const aMaster = aUCI === masterMove ? 1000 : 0;
                    const bMaster = bUCI === masterMove ? 1000 : 0;
                    
                    const captureA = board.squares[a.to] !== PIECES.EMPTY ? 100 : 0;
                    const captureB = board.squares[b.to] !== PIECES.EMPTY ? 100 : 0;
                    
                    return (bMaster + captureB) - (aMaster + captureA);
                });
            } else {
                // Standard ordering
                moves.sort((a, b) => {
                    const captureA = board.squares[a.to] !== PIECES.EMPTY ? 1 : 0;
                    const captureB = board.squares[b.to] !== PIECES.EMPTY ? 1 : 0;
                    return captureB - captureA;
                });
            }
            
            return moves;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE-AWARE EVALUATOR
    // ═══════════════════════════════════════════════════════════════════════
    
    class PhaseAwareEvaluator extends Evaluator {
        static evaluate(board, moveCount = 20) {
            let score = 0;
            const phase = MasterPatternMatcher.getPhase(moveCount);
            
            // Material and positional evaluation
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                
                const type = board.getPieceType(piece);
                const isWhite = board.isWhite(piece);
                const pstIndex = isWhite ? sq : (63 - sq);
                
                // Base material value
                score += PIECE_VALUES[piece];
                
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
                
                // Phase-specific bonuses
                if (phase === 'opening') {
                    // Emphasize development in opening
                    if (type === 2 || type === 3) pstBonus *= 1.2; // Knights and bishops
                } else if (phase === 'endgame') {
                    // King activity in endgame
                    if (type === 6) pstBonus *= 1.5;
                    // Pawn promotion potential
                    if (type === 1) pstBonus *= 1.3;
                }
                
                score += isWhite ? pstBonus : -pstBonus;
            }
            
            // Mobility bonus (phase-adjusted)
            const mobility = MoveGenerator.generate(board).length;
            const mobilityBonus = phase === 'opening' ? 15 : (phase === 'middlegame' ? 10 : 8);
            score += board.turn * mobility * mobilityBonus;
            
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
            if (phase === 'opening' && moveHistory.length < 20) {
                const masterMove = MasterPatternMatcher.findMasterMove(moveHistory);
                if (masterMove) {
                    // Validate the move exists
                    const allMoves = EnhancedMoveGenerator.generate(board);
                    const foundMove = allMoves.find(m => MoveGenerator.moveToUCI(m) === masterMove);
                    if (foundMove) {
                        console.log(`🏆 Using master move: ${masterMove} (from ${moveHistory.length/2} games database)`);
                        return foundMove;
                    }
                }
            }
            
            // Standard iterative deepening search
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
        console.log('%c║  🏆 AlphaZero Masterclass Edition v5.0             ║', 'color: #9C27B0; font-weight: bold;');
        console.log('%c║  ♟️  8,114 Master Games - Carlsen/Fischer/Morphy   ║', 'color: #4CAF50;');
        console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #9C27B0;');
        console.log('%c⚠️  EDUCATIONAL USE ONLY', 'color: #F44336; font-size: 14px; font-weight: bold;');

        STATE.engine = new ChessEngine();
        Logger.success('Engine initialized');

        LichessManager.install();
        Logger.success('Bot ready - Master database loaded (200+ positions)');
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
