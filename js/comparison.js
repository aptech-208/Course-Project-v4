const chairs = JSON.parse(localStorage.getItem('selectedChairs') || '[]');
const wrapper = document.getElementById('tableWrapper');
const empty = document.getElementById('emptyState');
const countEl = document.getElementById('selectionCount');

if (chairs.length === 0) {
    empty.style.display = 'block';
    countEl.textContent = 'No chairs selected.';
} else {
    countEl.textContent = chairs.length + ' chair' + (chairs.length > 1 ? 's' : '') + ' selected';

    const rows = [
        { label: 'Brand', key: 'brand' },
        { label: 'Price', key: 'price', cls: 'price-row' },
        { label: 'Material', key: 'material' },
        { label: 'Warranty', key: 'warranty' },
        { label: 'Weight', key: 'weight' },
    ];

    const headCells = chairs.map(c => `
        <th class="chair-col">
            <span class="chair-brand">${ c.brand }</span>
            ${ c.title }
        </th>
    `).join('');

    const bodyRows = rows.map(r => `
        <tr class="${ r.cls || '' }">
            <td class="feature-col">${ r.label }</td>
            ${ chairs.map(c => `<td>${ c[r.key] || '—' }</td>`).join('') }
        </tr>
    `).join('');

    wrapper.innerHTML = `
        <div class="comp-table-wrap">
            <table>
                <thead>
                    <tr>
                        <th class="feature-col"></th>
                        ${ headCells }
                    </tr>
                </thead>
                <tbody>${ bodyRows }</tbody>
            </table>
        </div>
    `;
}