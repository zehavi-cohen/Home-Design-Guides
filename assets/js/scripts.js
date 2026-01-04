const scope = {
};
/*
fetch('../assets/data/icons.json')
    .then(response => response.json())
    .then(data => {
        const del = [
            'changes',
            'ligatures',
            // 'styles',
            'voted',
            'free',
            'svg'
        ];
        Object.entries(data).forEach(([key, row]) => {
            del.forEach(cell => {
                delete row[cell]
            });
            row.id = key;
            scope.icons.push(row);
        });
        // scope.icons = data;
    })
    .catch(error => console.error('Error:', error));
*/

window.onload = () => {
    query('#search-icon').oninput = startTimer;
    showData();
    
    const exampleModal = query('#icon_modal')
    if (exampleModal) {
        exampleModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget

            const style = button.getAttribute('data-style');
            const data = getIconData(button.dataset.icon);
            query('#exampleModalLabel').innerHTML = `<i class="fa-${style} fa-${data.id}"></i> ${data.label}`;

            scope.current = {
                icon: data,
                style: style
            }
        })
    }


    query("#copy_content").onclick = () => {
        const family = scope.current.style == "brands" ? "Brands" : "Free";
        const weight = scope.current.style == "solid" ? 900 : 400;
        let str = `
        content: "\\${scope.current.icon.unicode}";
        font-family: "Font Awesome 6 ${family}";
        font-weight: ${weight};`;
        copy(str);
    }

    query("#copy_html_tag").onclick = () => {
        copy(query('#exampleModalLabel i').outerHTML);
    }
}

const query = (selector) => {
    return document.querySelector(selector);
}

const startTimer = e => {
    clearTimeout(scope.timer);
    scope.timer = setTimeout(() => { loadData(e); }, 500)
}

const showData = (iconsToShow = null) => {
    iconsToShow = iconsToShow ? iconsToShow : allIcons;
    query("#results").innerHTML = '';
    iconsToShow.forEach(row => {
        row.styles.forEach(style => {
            const a = document.createElement('button');
            a.classList.add('icon-btn');
            a.dataset.icon = row.id;
            a.dataset.style = style;
            a.setAttribute("data-bs-target", "#icon_modal");
            a.setAttribute("data-bs-toggle", "modal");
            a.innerHTML = `
            <i class="fa-${style} fa-${row.id}"></i>
            ${row.label}`;
            query("#results").append(a);
        });
    });
}

const loadData = e => {
    const s = query("#search-icon").value;
    const iconsToShow = filterIcons(s);
    showData(iconsToShow);
}

const copy = text => {
    navigator.clipboard.writeText(text).then(function () {
        alert('Copied!!');
    });
}

const getIconData = (iconid => {
    return allIcons.find(row => row.id === iconid);
});

const filterIcons = s => {
    s = s.toLowerCase().replace(" ", "-");
    return allIcons.filter(row => {
        if (row.id.indexOf(s) != -1)
            return true;
        for (term of row.search.terms) {
            if (term.indexOf(s) != -1)
                return true;
        };
        return false;
    });
}