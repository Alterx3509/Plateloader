if (window.WaterfowlIcons && !window.WaterfowlIcons.icon) {
  window.WaterfowlIcons = Object.freeze({...window.WaterfowlIcons, icon: window.WaterfowlIcons.render});
}
