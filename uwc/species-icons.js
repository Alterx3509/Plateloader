/* Species-aware field-guide icons for the UWC tracker. */
(() => {
  const P = {
    'mallard': {kind:'duck', head:'#0d5a4d', body:'#b9b6a8', chest:'#7b3f2b', wing:'#6e6f68', bill:'#e3bd3f', marks:['neckRing','blueSpeculum']},
    'pintail': {kind:'duck', head:'#6a4638', body:'#c9c6bc', chest:'#f2eee2', wing:'#8b8d87', bill:'#4b5962', marks:['pintail','whiteNeckStripe']},
    'american-wigeon': {kind:'duck', head:'#b9a98d', body:'#b78264', chest:'#a36e58', wing:'#6d706c', bill:'#879aa1', marks:['wigeonCrown','greenEyePatch']},
    'gadwall': {kind:'duck', head:'#7a7367', body:'#aaa394', chest:'#81796d', wing:'#625f58', bill:'#565755', marks:['blackRear','whiteWingPatch','mottle']},
    'northern-shoveler': {kind:'duck', head:'#0d5b50', body:'#a95736', chest:'#f0eee4', wing:'#7b5b46', bill:'#2d3438', marks:['shovelerBill','greenHead','whiteChest']},
    'green-winged-teal': {kind:'duck', head:'#8f4e35', body:'#aaa79e', chest:'#9a806f', wing:'#595b58', bill:'#4a4e4e', marks:['greenEyePatch','verticalShoulder','mottle']},
    'blue-winged-teal': {kind:'duck', head:'#667d87', body:'#a78667', chest:'#8e735e', wing:'#70695e', bill:'#42484b', marks:['whiteFaceCrescent','blueWingPatch','mottle']},
    'cinnamon-teal': {kind:'duck', head:'#a94f32', body:'#a94f32', chest:'#9b432d', wing:'#744e3f', bill:'#3d4549', marks:['blueWingPatch','redEye']},
    'wood-duck': {kind:'duck', head:'#155448', body:'#b98954', chest:'#7d332c', wing:'#344d49', bill:'#d84a3f', marks:['woodCrest','woodFace','whiteShoulder']},
    'black-duck': {kind:'duck', head:'#4a4034', body:'#56493b', chest:'#4d4237', wing:'#4d4339', bill:'#83923f', marks:['purpleSpeculum','mottle']},
    'mottled-duck': {kind:'duck', head:'#76614b', body:'#77614c', chest:'#6c5744', wing:'#605348', bill:'#d0b740', marks:['blueSpeculum','mottle','darkCap']},
    'black-bellied-whistling-duck': {kind:'duck', head:'#a6a099', body:'#9b4b35', chest:'#9b4b35', wing:'#a07765', bill:'#e46d6d', marks:['blackBelly','grayFace','pinkLegHint']},
    'fulvous-whistling-tree-duck': {kind:'duck', head:'#b8794f', body:'#b7784c', chest:'#bc8157', wing:'#6c4e3c', bill:'#555a5a', marks:['fulvousFlank','darkBack']},
    'canvasback': {kind:'duck', head:'#9a4f37', body:'#e2e0d7', chest:'#25292a', wing:'#aaa9a1', bill:'#30373b', marks:['canvasSlope','blackChest']},
    'redhead': {kind:'duck', head:'#a24f35', body:'#aaaeb0', chest:'#272a2c', wing:'#777d7f', bill:'#7895a0', marks:['blackChest','billTip']},
    'greater-scaup': {kind:'duck', head:'#183b36', body:'#eceae2', chest:'#222729', wing:'#9fa3a1', bill:'#7692a0', marks:['scaupBack','roundHead','billTip']},
    'lesser-scaup': {kind:'duck', head:'#352b43', body:'#e7e6df', chest:'#222629', wing:'#979b9c', bill:'#7692a0', marks:['scaupBack','peakedHead','billTip']},
    'common-goldeneye': {kind:'duck', head:'#123e39', body:'#ecece6', chest:'#ecece6', wing:'#23292b', bill:'#34393a', marks:['roundCheekSpot','blackBack','goldEye']},
    'barrows-goldeneye': {kind:'duck', head:'#2f2440', body:'#ecece6', chest:'#ecece6', wing:'#23292b', bill:'#303536', marks:['crescentCheekSpot','blackBack','shoulderSpots','goldEye']},
    'ruddy-duck': {kind:'duck', head:'#171b1d', body:'#9e4c32', chest:'#8f432e', wing:'#744536', bill:'#5ba4c7', marks:['whiteCheek','ruddyTail']},
    'bufflehead': {kind:'duck', head:'#162f2e', body:'#f0efe9', chest:'#f0efe9', wing:'#1f2426', bill:'#454c50', marks:['bufflePatch','blackBack']},
    'ring-necked-duck': {kind:'duck', head:'#171b1e', body:'#9ea2a1', chest:'#171b1e', wing:'#202527', bill:'#718792', marks:['whiteShoulderCrescent','billRing','blackBack']},
    'hooded-merganser': {kind:'duck', head:'#1b1f21', body:'#a55e3f', chest:'#f0eee7', wing:'#6a6058', bill:'#353a3c', marks:['hoodCrest','blackBack']},
    'common-merganser': {kind:'duck', head:'#173f38', body:'#eee9df', chest:'#eee5dd', wing:'#d4d0c9', bill:'#cf554a', marks:['merganserBill','blackBack']},
    'red-breasted-merganser': {kind:'duck', head:'#173b36', body:'#8d9696', chest:'#9d5f49', wing:'#697373', bill:'#cf554a', marks:['merganserBill','shaggyCrest','mottle']},
    'king-eider': {kind:'duck', head:'#9fc2c1', body:'#f0ece1', chest:'#e3b497', wing:'#292d2e', bill:'#e98038', marks:['kingEiderFace','blackBack']},
    'common-eider': {kind:'duck', head:'#eceae2', body:'#eceae2', chest:'#eceae2', wing:'#252a2b', bill:'#85928b', marks:['blackCap','eiderNape','blackBelly']},
    'long-tailed-duck': {kind:'duck', head:'#f0eee7', body:'#e6e1d7', chest:'#eeeae0', wing:'#3a3330', bill:'#d67468', marks:['darkCheek','longTail','blackBack']},
    'harlequin-duck': {kind:'duck', head:'#354c5a', body:'#425766', chest:'#5b3c39', wing:'#313f48', bill:'#52606a', marks:['harlequinFace','harlequinFlank']},
    'black-scoter': {kind:'duck', head:'#17191a', body:'#17191a', chest:'#17191a', wing:'#111314', bill:'#e58c2b', marks:['scoterKnob']},
    'surf-scoter': {kind:'duck', head:'#17191a', body:'#17191a', chest:'#17191a', wing:'#111314', bill:'#e76632', marks:['surfWhitePatches','surfBill']},
    'white-winged-scoter': {kind:'duck', head:'#2b2927', body:'#2a2927', chest:'#2a2927', wing:'#252525', bill:'#dc6d37', marks:['whiteEyeComma','whiteWingPatch','scoterBill']},
    'tundra-swan': {kind:'swan', body:'#f1f0e9', neck:'#f1f0e9', head:'#f1f0e9', bill:'#202526', marks:['swanYellowLore']},
    'sandhill-crane': {kind:'crane', body:'#8c8d89', neck:'#8e8f8b', head:'#858681', bill:'#8a806c', marks:['redCrown']},
    'canada-goose': {kind:'goose', body:'#786a58', neck:'#1d2224', head:'#1d2224', chest:'#8b7e6b', bill:'#24282a', marks:['chinstrap']},
    'cackling-canada-goose': {kind:'gooseSmall', body:'#746755', neck:'#1d2224', head:'#1d2224', chest:'#877967', bill:'#24282a', marks:['chinstrap']},
    'snow-goose': {kind:'goose', body:'#efeee7', neck:'#efeee7', head:'#efeee7', chest:'#efeee7', bill:'#db8b83', marks:['blackWingTips','grinningPatch']},
    'blue-goose': {kind:'goose', body:'#5b6268', neck:'#f0eee8', head:'#f0eee8', chest:'#5b6268', bill:'#db8b83', marks:['blueGooseBody','grinningPatch']},
    'ross-goose': {kind:'gooseSmall', body:'#f1f0e9', neck:'#f1f0e9', head:'#f1f0e9', chest:'#f1f0e9', bill:'#d98f87', marks:['blackWingTips','rossBill']},
    'white-fronted-goose': {kind:'goose', body:'#7c6d59', neck:'#6f614f', head:'#706250', chest:'#7c6d59', bill:'#df927c', marks:['whiteForehead','bellyBars']},
    'brant-goose': {kind:'goose', body:'#454747', neck:'#222627', head:'#222627', chest:'#4e5050', bill:'#24282a', marks:['brantCollar']}
  };

  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function icon(id) {
    const p = P[id] || P.mallard;
    const drawing = p.kind === 'swan' ? swan(p) : p.kind === 'crane' ? crane(p) : p.kind.startsWith('goose') ? goose(p, p.kind === 'gooseSmall') : duck(p);
    return `<svg class="waterfowl-icon" viewBox="0 0 120 72" role="img" aria-label="${esc(id.replaceAll('-', ' '))} field guide icon" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="118" height="70" rx="17" fill="#111516" fill-opacity=".86" stroke="#c99848" stroke-opacity=".28"/><ellipse cx="58" cy="59" rx="43" ry="3" fill="#000" opacity=".22"/>${drawing}</svg>`;
  }

  function duck(p) {
    const marks = new Set(p.marks || []);
    const tail = marks.has('pintail') ? `<path d="M27 47 L5 41 L27 53 Z" fill="#e9e5da"/><path d="M28 46 L2 48 L28 51 Z" fill="#1f2325"/>` : marks.has('longTail') ? `<path d="M28 47 L3 55 L29 51 Z" fill="#2a2928"/><path d="M25 48 L0 61" stroke="#2a2928" stroke-width="3" stroke-linecap="round"/>` : marks.has('ruddyTail') ? `<path d="M27 47 L13 34 L31 44 Z" fill="#3d2f29"/>` : `<path d="M29 46 L15 42 L28 53 Z" fill="${p.body}"/>`;
    const headY = marks.has('woodCrest') || marks.has('shaggyCrest') ? 25 : 27;
    const bill = marks.has('shovelerBill') ? `<path d="M99 25 C111 23 118 25 118 29 C111 33 103 32 97 30 Z" fill="${p.bill}"/>` : marks.has('merganserBill') ? `<path d="M98 27 L119 30 L98 31 Z" fill="${p.bill}"/>` : marks.has('canvasSlope') ? `<path d="M96 24 L118 31 L97 32 Z" fill="${p.bill}"/>` : `<path d="M99 27 L116 30 L99 33 Z" fill="${p.bill}"/>`;
    const headShape = marks.has('canvasSlope') ? `<path d="M78 34 C78 21 83 14 91 14 C101 17 105 23 101 33 C94 39 85 40 78 34 Z" fill="${p.head}"/>` : `<circle cx="89" cy="${headY}" r="13" fill="${p.head}"/>`;
    const crest = marks.has('woodCrest') ? `<path d="M80 20 C88 8 101 10 106 18 C98 16 95 20 92 23 Z" fill="#153e39"/><path d="M81 18 C91 12 99 13 104 18" fill="none" stroke="#f1eee4" stroke-width="2.2"/>` : marks.has('hoodCrest') ? `<path d="M75 30 C70 10 96 4 107 23 C98 17 88 17 78 32 Z" fill="#171b1d"/><path d="M78 27 C80 13 94 10 101 23 C91 19 86 22 80 30 Z" fill="#eeeae1"/>` : marks.has('shaggyCrest') ? `<path d="M79 19 L72 12 M82 18 L78 9 M85 17 L84 8" stroke="${p.head}" stroke-width="3" stroke-linecap="round"/>` : '';
    const body = `<ellipse cx="58" cy="46" rx="34" ry="17" fill="${p.body}"/><ellipse cx="39" cy="45" rx="14" ry="14" fill="${p.chest || p.body}"/><ellipse cx="64" cy="45" rx="22" ry="12" fill="${p.wing || p.body}" opacity=".92"/>`;
    const neck = `<path d="M76 40 C79 35 81 31 82 29" stroke="${p.head}" stroke-width="12" stroke-linecap="round"/>`;
    return `${tail}${body}${neck}${headShape}${crest}${bill}${duckMarks(p, marks)}<circle cx="92" cy="24" r="1.9" fill="#0b0c0d"/><circle cx="92.5" cy="23.4" r=".55" fill="#fff" opacity=".85"/>`;
  }

  function duckMarks(p, m) {
    let x = '';
    if (m.has('neckRing')) x += `<path d="M79 34 C84 37 91 39 98 35" fill="none" stroke="#f2efe7" stroke-width="2.5"/>`;
    if (m.has('whiteNeckStripe')) x += `<path d="M82 31 C79 36 75 40 67 46" fill="none" stroke="#f3f0e7" stroke-width="4" stroke-linecap="round"/>`;
    if (m.has('blueSpeculum') || m.has('blueWingPatch')) x += `<path d="M49 45 C59 39 69 40 76 45 C68 48 59 49 50 48 Z" fill="#477aa8" stroke="#d9dddb" stroke-width="1"/>`;
    if (m.has('purpleSpeculum')) x += `<path d="M49 45 C59 40 69 41 76 45 C68 49 59 49 50 48 Z" fill="#5d477c" stroke="#d7d4c9" stroke-width="1"/>`;
    if (m.has('wigeonCrown')) x += `<path d="M82 17 C88 13 96 14 101 19" fill="none" stroke="#eee3c8" stroke-width="5" stroke-linecap="round"/>`;
    if (m.has('greenEyePatch')) x += `<path d="M81 23 C85 18 94 17 99 20 C95 25 88 28 81 27 Z" fill="#185b4b"/>`;
    if (m.has('whiteFaceCrescent')) x += `<path d="M84 17 C80 22 80 28 84 34" fill="none" stroke="#eef0ea" stroke-width="3" stroke-linecap="round"/>`;
    if (m.has('verticalShoulder')) x += `<path d="M45 34 L44 51" stroke="#f1eee5" stroke-width="4" stroke-linecap="round"/>`;
    if (m.has('whiteWingPatch')) x += `<path d="M52 40 L65 40 L73 47 L57 48 Z" fill="#ecebe4"/>`;
    if (m.has('whiteShoulder')) x += `<path d="M40 33 C47 36 51 39 53 44" fill="none" stroke="#f0eee6" stroke-width="3"/>`;
    if (m.has('woodFace')) x += `<path d="M79 18 C85 18 90 20 96 18 M81 31 C87 28 96 30 101 25" fill="none" stroke="#f5f0e5" stroke-width="2.2" stroke-linecap="round"/><path d="M88 17 C90 13 96 13 100 17" fill="none" stroke="#8b3e5a" stroke-width="2"/>`;
    if (m.has('blackRear')) x += `<path d="M25 42 C35 40 41 45 41 55 C31 55 26 51 25 42 Z" fill="#202425"/>`;
    if (m.has('blackChest')) x += `<ellipse cx="39" cy="44" rx="13" ry="14" fill="#222628"/>`;
    if (m.has('blackBack')) x += `<path d="M47 34 C62 29 77 32 84 41 C72 39 60 39 49 44 Z" fill="#252a2b"/>`;
    if (m.has('blackBelly')) x += `<path d="M35 50 C51 56 68 57 80 50 C70 61 44 63 35 50 Z" fill="#1f2223"/>`;
    if (m.has('blackCap')) x += `<path d="M78 24 C80 14 90 11 98 16 C95 20 88 22 78 24 Z" fill="#202425"/>`;
    if (m.has('darkCap')) x += `<path d="M80 20 C87 16 95 16 100 20" fill="none" stroke="#433a31" stroke-width="5" stroke-linecap="round"/>`;
    if (m.has('grayFace')) x += `<ellipse cx="89" cy="25" rx="10" ry="11" fill="#a8a5a0" opacity=".9"/>`;
    if (m.has('fulvousFlank')) x += `<path d="M32 52 C43 55 55 56 65 53" fill="none" stroke="#e2bd85" stroke-width="3"/>`;
    if (m.has('darkBack')) x += `<path d="M49 34 C61 31 75 34 83 41" fill="none" stroke="#5a4034" stroke-width="5" stroke-linecap="round"/>`;
    if (m.has('mottle')) x += `<g fill="#d8d0bd" opacity=".28"><circle cx="47" cy="41" r="1.1"/><circle cx="54" cy="50" r="1"/><circle cx="63" cy="42" r="1"/><circle cx="69" cy="51" r="1.1"/><circle cx="36" cy="47" r="1"/></g>`;
    if (m.has('redEye')) x += `<circle cx="92" cy="24" r="2.1" fill="#d64536"/>`;
    if (m.has('goldEye')) x += `<circle cx="92" cy="24" r="2.1" fill="#d3b43d"/>`;
    if (m.has('canvasSlope')) x += `<path d="M98 29 L116 31" stroke="#111416" stroke-width="1.2"/>`;
    if (m.has('billTip')) x += `<path d="M112 29 L116 30 L112 32 Z" fill="#25292b"/>`;
    if (m.has('scaupBack')) x += `<g stroke="#656a69" stroke-width=".7" opacity=".8"><path d="M52 38 l22 10 M56 36 l22 10 M48 42 l22 10"/></g>`;
    if (m.has('roundHead')) x += `<path d="M80 17 C88 12 98 14 102 22" fill="none" stroke="#183b36" stroke-width="4"/>`;
    if (m.has('peakedHead')) x += `<path d="M82 16 L89 11 L96 17" fill="#352b43"/>`;
    if (m.has('roundCheekSpot')) x += `<circle cx="82" cy="27" r="4.5" fill="#f3efe4"/>`;
    if (m.has('crescentCheekSpot')) x += `<path d="M80 22 C85 21 87 25 85 31 C82 30 79 27 80 22 Z" fill="#f3efe5"/>`;
    if (m.has('shoulderSpots')) x += `<g fill="#f3efe5"><circle cx="48" cy="37" r="2.5"/><circle cx="52" cy="41" r="2.2"/><circle cx="56" cy="45" r="2"/></g>`;
    if (m.has('whiteCheek')) x += `<ellipse cx="85" cy="28" rx="7" ry="8" fill="#efeee8"/>`;
    if (m.has('bufflePatch')) x += `<path d="M80 18 C87 13 99 14 103 22 C96 25 90 29 84 31 Z" fill="#f1efe7"/>`;
    if (m.has('whiteShoulderCrescent')) x += `<path d="M42 34 C48 36 50 43 48 50" fill="none" stroke="#f0eee7" stroke-width="3"/>`;
    if (m.has('billRing')) x += `<path d="M108 29 L111 31" stroke="#ece9df" stroke-width="2"/>`;
    if (m.has('hoodCrest')) x += `<path d="M77 30 C81 20 91 18 101 23" fill="none" stroke="#f0ede4" stroke-width="3"/>`;
    if (m.has('kingEiderFace')) x += `<path d="M78 22 C82 13 93 12 101 18 L98 26 C90 24 85 28 80 33 Z" fill="#a8c8c7"/><path d="M82 30 C87 26 93 26 98 28" fill="none" stroke="#4b8d69" stroke-width="3"/><circle cx="103" cy="25" r="4" fill="#e98b36"/>`;
    if (m.has('eiderNape')) x += `<path d="M80 33 C86 30 91 31 96 35" fill="none" stroke="#95bea8" stroke-width="4"/>`;
    if (m.has('darkCheek')) x += `<ellipse cx="86" cy="27" rx="6" ry="7" fill="#493d39"/>`;
    if (m.has('harlequinFace')) x += `<g fill="none" stroke="#f4eee3" stroke-width="2.4" stroke-linecap="round"><path d="M82 16 C86 20 88 23 88 28"/><path d="M95 18 C99 21 100 25 100 29"/><path d="M79 33 C84 34 88 36 92 39"/></g>`;
    if (m.has('harlequinFlank')) x += `<path d="M42 39 C49 35 58 37 62 43 L57 51 C49 49 45 46 42 39 Z" fill="#8a4434"/><path d="M58 36 L62 51" stroke="#f1eee5" stroke-width="2.2"/>`;
    if (m.has('scoterKnob')) x += `<circle cx="101" cy="27" r="4.3" fill="#e58c2b"/>`;
    if (m.has('surfWhitePatches')) x += `<path d="M82 15 C87 13 93 14 96 17 L92 22 L84 21 Z" fill="#eeeae2"/><path d="M97 29 C101 28 104 30 104 34 C100 36 96 34 97 29 Z" fill="#eeeae2"/>`;
    if (m.has('surfBill')) x += `<path d="M100 25 L116 29 L105 34 L99 31 Z" fill="#ec6c32"/><path d="M105 27 L111 29 L106 31 Z" fill="#f0c94d"/>`;
    if (m.has('whiteEyeComma')) x += `<path d="M83 19 C88 18 91 22 88 26 C86 24 83 23 83 19 Z" fill="#eeeae2"/>`;
    if (m.has('scoterBill')) x += `<path d="M100 26 L116 30 L100 33 Z" fill="#da6e37"/><path d="M103 26 L108 28 L103 31 Z" fill="#e8d7b7"/>`;
    if (m.has('greenHead')) x += `<path d="M79 20 C85 14 96 14 102 21" fill="none" stroke="#0d5b50" stroke-width="3"/>`;
    if (m.has('whiteChest')) x += `<ellipse cx="39" cy="44" rx="13" ry="13" fill="#eeeae1"/>`;
    if (m.has('pinkLegHint')) x += `<path d="M53 58 v6 M66 58 v6" stroke="#db7770" stroke-width="2" stroke-linecap="round"/>`;
    return x;
  }

  function goose(p, small) {
    const m = new Set(p.marks || []);
    const s = small ? .88 : 1;
    const bodyRx = 34 * s, bodyRy = 16 * s, bodyCx = small ? 55 : 54;
    const neckWidth = small ? 9 : 11;
    const headR = small ? 8.5 : 9.5;
    const headX = small ? 88 : 91;
    const headY = small ? 20 : 17;
    let x = `<ellipse cx="${bodyCx}" cy="47" rx="${bodyRx}" ry="${bodyRy}" fill="${p.body}"/><ellipse cx="39" cy="46" rx="13" ry="13" fill="${p.chest || p.body}"/><path d="M76 44 C80 33 81 24 ${headX-3} ${headY+6}" fill="none" stroke="${p.neck}" stroke-width="${neckWidth}" stroke-linecap="round"/><circle cx="${headX}" cy="${headY}" r="${headR}" fill="${p.head}"/><path d="M${headX+8} ${headY} L${headX+22} ${headY+3} L${headX+8} ${headY+5} Z" fill="${p.bill}"/><path d="M24 44 L10 40 L23 51 Z" fill="${p.body}"/>`;
    if (m.has('chinstrap')) x += `<path d="M83 ${headY+4} C87 ${headY+8} 94 ${headY+8} 98 ${headY+3}" fill="none" stroke="#f0eee6" stroke-width="4" stroke-linecap="round"/>`;
    if (m.has('blackWingTips')) x += `<path d="M31 38 C43 33 59 34 75 42 L65 49 C51 46 41 43 31 38 Z" fill="#202426"/>`;
    if (m.has('grinningPatch')) x += `<path d="M100 18 L111 20" stroke="#222627" stroke-width="1.2"/>`;
    if (m.has('blueGooseBody')) x += `<path d="M35 36 C51 31 69 35 79 44" fill="none" stroke="#6f7880" stroke-width="5" stroke-linecap="round"/>`;
    if (m.has('rossBill')) x += `<circle cx="99" cy="${headY+1}" r="2.2" fill="#cf7f78"/><path d="M100 ${headY} L110 ${headY+2}" stroke="#f0ddd3" stroke-width="1.1"/>`;
    if (m.has('whiteForehead')) x += `<path d="M85 ${headY-7} C90 ${headY-9} 95 ${headY-7} 98 ${headY-4}" fill="none" stroke="#f0eee7" stroke-width="4" stroke-linecap="round"/>`;
    if (m.has('bellyBars')) x += `<g stroke="#423b34" stroke-width="1.7" opacity=".8"><path d="M43 51 l4 7"/><path d="M52 52 l4 7"/><path d="M61 51 l4 7"/></g>`;
    if (m.has('brantCollar')) x += `<path d="M81 28 C85 31 89 32 94 31" fill="none" stroke="#e7e4db" stroke-width="2" stroke-linecap="round"/>`;
    x += `<circle cx="${headX+2}" cy="${headY-2}" r="1.6" fill="#090a0b"/><circle cx="${headX+2.4}" cy="${headY-2.4}" r=".45" fill="#fff" opacity=".8"/>`;
    return x;
  }

  function swan(p) {
    const m = new Set(p.marks || []);
    let x = `<ellipse cx="50" cy="49" rx="35" ry="15" fill="${p.body}"/><path d="M72 47 C83 43 74 28 82 19 C88 13 95 14 98 20" fill="none" stroke="${p.neck}" stroke-width="10" stroke-linecap="round"/><circle cx="98" cy="20" r="7" fill="${p.head}"/><path d="M104 20 L118 23 L104 25 Z" fill="${p.bill}"/><path d="M20 46 L8 42 L19 52 Z" fill="${p.body}"/>`;
    if (m.has('swanYellowLore')) x += `<path d="M102 18 L106 20 L103 22 Z" fill="#d4b33e"/>`;
    x += `<circle cx="100" cy="18" r="1.4" fill="#0a0b0c"/>`;
    return x;
  }

  function crane(p) {
    const m = new Set(p.marks || []);
    let x = `<ellipse cx="52" cy="43" rx="28" ry="12" fill="${p.body}"/><path d="M70 40 C78 34 77 22 83 14" fill="none" stroke="${p.neck}" stroke-width="7" stroke-linecap="round"/><circle cx="86" cy="12" r="6.5" fill="${p.head}"/><path d="M92 11 L116 13 L92 15 Z" fill="${p.bill}"/><path d="M30 43 L15 39 L28 49 Z" fill="#777a77"/><path d="M45 53 L42 69 M58 53 L61 69" stroke="#837766" stroke-width="2.2" stroke-linecap="round"/>`;
    if (m.has('redCrown')) x += `<path d="M81 8 C84 5 89 5 92 8" fill="none" stroke="#a94236" stroke-width="3.5" stroke-linecap="round"/>`;
    x += `<circle cx="88" cy="11" r="1.3" fill="#0a0b0c"/>`;
    return x;
  }

  function paint(root = document) {
    root.querySelectorAll('[data-species]').forEach(node => {
      const id = node.dataset.species;
      if (!P[id]) return;
      const bird = node.querySelector('.bird-mark');
      if (bird && bird.dataset.iconSpecies !== id) {
        bird.innerHTML = icon(id);
        bird.dataset.iconSpecies = id;
      }
      const thumb = node.querySelector('.thumb');
      if (thumb && !thumb.querySelector('img') && thumb.dataset.iconSpecies !== id) {
        thumb.innerHTML = icon(id);
        thumb.dataset.iconSpecies = id;
      }
    });
  }

  const style = document.createElement('style');
  style.textContent = `.bird-mark{width:64px;height:42px;display:flex;align-items:center}.bird-mark .waterfowl-icon{width:64px;height:42px;display:block;filter:drop-shadow(0 3px 5px rgba(0,0,0,.28))}.species-card.harvested .bird-mark .waterfowl-icon{filter:drop-shadow(0 3px 7px rgba(0,0,0,.35)) saturate(1.08)}.trophy-row .thumb .waterfowl-icon{width:100%;height:100%;padding:4px;display:block}.species-card .bird-mark{font-size:0;opacity:1}@media(min-width:620px){.bird-mark,.bird-mark .waterfowl-icon{width:72px;height:46px}}`;
  document.head.appendChild(style);

  const target = document.getElementById('screen') || document.body;
  const observer = new MutationObserver(() => paint(target));
  observer.observe(target, {childList:true, subtree:true});
  paint(target);
  window.WaterfowlIcons = Object.freeze({render: icon, profiles: P, repaint: paint});
})();
