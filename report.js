const gaps = await fetch("results.json").then(r => r.json());

const gapIds = {
  idl: ["idl"],
  css: ["css.properties", "css.atrules"],
  elements: ["elements"]
};


for (const id of Object.keys(gapIds)) {
  const table = document.getElementById(id);
  for(let shortname of Object.keys(gaps).sort((s1, s2) => gaps[s1].title?.localeCompare(gaps[s2]?.title))) {
    let tr = document.createElement("tr");
    const th = document.createElement("th");
    tr.appendChild(th);
    const specData= gaps[shortname];
    for (const gapId of gapIds[id]) {
      if (specData[gapId]) {
	if (specData.url) {
	  const link = document.createElement("a");
	  link.href = specData.url;
	  link.textContent = specData.title;
	  th.append(link);
	} else {
	  th.textContent = shortname;
	}
	if (specData[gapId].bcd || specData[gapId].mdn) {
	  th.setAttribute("rowspan", Object.keys(specData[gapId]?.bcd || {}).length + Object.keys(specData[gapId]?.mdn || {}).length);
	  for (let feature of Object.keys(specData[gapId].bcd || {})) {
	    const bcdTd = document.createElement("td");
	    const mdnTd = document.createElement("td");
	    const syncTd = document.createElement("td");
	    if (Array.isArray(specData[gapId].bcd[feature])) {
	      const ul = document.createElement("ul");
	      specData[gapId].bcd[feature].forEach(t => {
		const li = document.createElement("li");
		li.textContent = feature + "." + t;
		ul.appendChild(li);
	      });
	      bcdTd.appendChild(ul);
	    } else {
	      bcdTd.textContent = feature;
	    }
	    bcdTd.className = "missing";
	    // TODO: we assume it's missing in mdn if missing in bcd
	    mdnTd.className = "missing";
	    mdnTd.textContent = "";
	    tr.append(bcdTd, mdnTd, syncTd);
	    table.append(tr);
	    tr = document.createElement("tr");
	  }
	  for (let feature of Object.keys(specData[gapId].mdn || {})) {
	    const bcdTd = document.createElement("td");
	    const mdnTd = document.createElement("td");
	    const syncTd = document.createElement("td");
	    if (Array.isArray(specData[gapId].mdn[feature])) {
	      const ul = document.createElement("ul");
	      specData[gapId].mdn[feature].forEach(t => {
		const li = document.createElement("li");
		li.textContent = feature + "." + t;
		ul.appendChild(li);
	      });
	      mdnTd.appendChild(ul);
	    } else {
	      mdnTd.textContent = feature;
	    }
	    mdnTd.className = "missing";
	    tr.append(bcdTd, mdnTd, syncTd);
	    table.append(tr);
	    tr = document.createElement("tr");
	  }
	}
      }
    }
  }
}