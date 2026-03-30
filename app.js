const categoryPhrases = {
    restaurant: [
      { ja: "メニューをください", zh: "請給我菜單", pinyin: "Qǐng gěi wǒ càidān" },
      { ja: "○○はいくらですか？", zh: "這個多少錢？", pinyin: "Zhège duōshǎo qián?" },
      { ja: "おすすめは何ですか？", zh: "有什麼推薦的嗎？", pinyin: "Yǒu shé me tuījiàn de ma?" },
      { ja: "お会計をお願いします", zh: "我要結帳", pinyin: "Wǒ yào jiézhàng" },
      { ja: "パクチーを抜いてください", zh: "不要香菜", pinyin: "Bùyào xiāngcài" }
    ],
    tourist: [
      { ja: "入場料はいくらですか？", zh: "門票多少錢？", pinyin: "Ménpiào duōshǎo qián?" },
      { ja: "写真を撮ってもいいですか？", zh: "可以拍照嗎？", pinyin: "Kěyǐ pāizhào ma?" },
      { ja: "トイレはどこですか？", zh: "洗手間在哪裡？", pinyin: "Xǐshǒujiān zài nǎlǐ?" },
      { ja: "日本語のパンフレットはありますか？", zh: "有日文導覽手冊嗎？", pinyin: "Yǒu rìwén dǎolǎn shǒucè ma?" }
    ],
    nightmarket: [
      { ja: "○○はいくらですか？", zh: "這個多少錢？", pinyin: "Zhège duōshǎo qián?" },
      { ja: "少し安くしてくれませんか？", zh: "可以算便宜一點嗎？", pinyin: "Kěyǐ suàn piányí yīdiǎn ma?" },
      { ja: "持ち帰りでお願いします", zh: "我要外帶", pinyin: "Wǒ yào wàidài" },
      { ja: "ここで食べます", zh: "內用", pinyin: "Nèiyòng" }
    ]
  };

  // ビブグルマン掲載店（ミシュランガイドサイト指定URLより抜粋）
  const bibGourmandList = [
    "Jhen Pin 台北",
    "Lai Kang Shan 台北",
    "Wang's Broth 台北",
    "Yonghe Chia Hsiang Soy Milk 台北",
    "SÒNG JHAO 台北",
    "Dian Xiao Er (Datong North Road) 台北",
    "San Tung 台北",
    "Mai Mien Yen Tsai 台北",
    "Serenity (Zhongzheng) 台北",
    "Saffron Fine Indian Cuisine 台北",
    "Pàng 台北",
    "Guang Xing Pork Knuckle 台北",
    "Chung Chia Sheng Jian Bao 台北"
  ];
  
let map;
let placesService;
let markers = [];
let stallMarkers = []; 
let currentCategory = 'all';
let currentActiveSpot = null;

const TAIPEI_CENTER = { lat: 25.0478, lng: 121.5319 };

// Initialization logic
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initModal();
    // Google Maps is loaded dynamically via script tag in HTML directly
});

window.initMap = function() {
    if(typeof google === 'undefined') return;
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: TAIPEI_CENTER,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "simplified" }
                ]
            }
        ]
    });

    placesService = new google.maps.places.PlacesService(map);
    
    renderSpots(currentCategory);
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.dataset.filter;
            renderSpots(currentCategory);
        });
    });
}

// 動的検索
async function renderSpots(category) {
    if(!placesService) return;

    const spotListContainer = document.getElementById('spot-list');
    spotListContainer.innerHTML = '<p style="padding:1rem;">検索中...</p>';
    
    clearMarkers();
    clearStallMarkers();

    if (category === 'michelin') {
        // ミシュラン（ビブグルマン）の場合は、リストを用いて複数回リクエストを投げる
        spotListContainer.innerHTML = '<p style="padding:1rem;">ビブグルマン掲載店を検索中（複数取得のため少し時間がかかります）...</p>';
        const bounds = new google.maps.LatLngBounds();
        const resultsArray = [];

        // LIMIT RATE to avoid OVER_QUERY_LIMIT
        for (let i = 0; i < bibGourmandList.length; i++) {
            const queryName = bibGourmandList[i];
            try {
                const rs = await doTextSearch({ query: queryName, location: TAIPEI_CENTER });
                if (rs && rs.length > 0) {
                    const place = rs[0]; // 最初の最も適した結果
                    place.customCategory = 'michelin';
                    place.phraseType = 'restaurant';
                    resultsArray.push(place);
                    bounds.extend(place.geometry.location);
                }
            } catch (e) {
                console.warn(e);
            }
            // Add a short delay (200ms) to respect quota Limits API calls/sec
            await new Promise(r => setTimeout(r, 200));
        }

        spotListContainer.innerHTML = '';
        if (resultsArray.length === 0) {
            spotListContainer.innerHTML = '<p style="padding:1rem;">店舗が見つかりませんでした。</p>';
            return;
        }

        renderResultItems(resultsArray, spotListContainer);
        if (map) {
            map.fitBounds(bounds);
        }

    } else {
        // 通常の単一クエリ検索
        let query = "台北 観光名所";
        if (category === 'highRated') query = "台北 飲食店";
        else if (category === 'nightmarket') query = "台北 夜市";

        const request = {
            query: query,
            location: TAIPEI_CENTER,
            radius: 10000 
        };

        try {
            let rs = await doTextSearch(request);
            spotListContainer.innerHTML = '';

            if (category === 'highRated') {
                rs = rs.filter(r => r.rating && r.rating >= 3.5);
            }
            rs = rs.slice(0, 20);

            if(rs.length === 0) {
                spotListContainer.innerHTML = '<p style="padding:1rem;">一致するスポットが見つかりません。</p>';
                return;
            }

            const bounds = new google.maps.LatLngBounds();
            rs.forEach(place => {
                place.customCategory = category === 'all' ? 'tourist' : category;
                if (place.customCategory === 'highRated') place.phraseType = 'restaurant';
                else if (place.customCategory === 'nightmarket') place.phraseType = 'nightmarket';
                else place.phraseType = 'tourist';
                
                if (place.geometry && place.geometry.location) {
                    bounds.extend(place.geometry.location);
                }
            });

            renderResultItems(rs, spotListContainer);

            if (map) {
                map.fitBounds(bounds);
                const listener = google.maps.event.addListener(map, "idle", function() { 
                    if (map.getZoom() > 16) map.setZoom(16); 
                    google.maps.event.removeListener(listener); 
                });
            }

        } catch (e) {
            spotListContainer.innerHTML = `<p style="padding:1rem;">検索エラーが発生しました。再度お試しください。</p>`;
        }
    }
}

// Promisified textSearch to handle async loops easily
function doTextSearch(request) {
    return new Promise((resolve, reject) => {
        placesService.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                resolve([]);
            } else {
                reject(status);
            }
        });
    });
}

function renderResultItems(places, container) {
    places.forEach(place => {
        // 1. Create list item
        const card = document.createElement('div');
        card.className = 'spot-card';
        card.innerHTML = `
            <div class="spot-card-header">
                <div>
                    <h3 class="spot-title">${place.name}</h3>
                    <p class="spot-title-zh">${place.formatted_address || ''}</p>
                </div>
                <span class="category-badge badge-${place.customCategory}">${getCategoryName(place.customCategory)}</span>
            </div>
            <p class="spot-info">クチコミ数: ${place.user_ratings_total || 0}件</p>
            <div class="card-footer">
                ${place.rating ? `<span class="card-rating"><i class="ri-star-fill"></i> ${place.rating}</span>` : '<span></span>'}
                <button class="view-btn">詳細を見る <i class="ri-arrow-right-line"></i></button>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(place));
        container.appendChild(card);
        
        // 2. Create map marker
        if (map && place.geometry && place.geometry.location) {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                animation: google.maps.Animation.DROP
            });
            
            marker.addListener('click', () => {
                openModal(place);
            });
            
            markers.push(marker);
        }
    });
}

function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}
function clearStallMarkers() {
    stallMarkers.forEach(m => m.setMap(null));
    stallMarkers = [];
}

function getCategoryName(category) {
    switch(category) {
        case 'highRated': return '高評価店';
        case 'michelin': return 'ミシュラン';
        case 'tourist': return '観光スポット';
        case 'nightmarket': return '夜市';
        default: return 'おすすめ';
    }
}

// Modal logic
function initModal() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            clearStallMarkers();
        }
    });

    document.querySelectorAll('.transit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(!currentActiveSpot || !currentActiveSpot.geometry) return;
            const mode = e.currentTarget.dataset.mode;
            const lat = currentActiveSpot.geometry.location.lat();
            const lng = currentActiveSpot.geometry.location.lng();
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`;
            window.open(url, '_blank');
        });
    });
}

function openModal(place) {
    currentActiveSpot = place;
    
    document.getElementById('modal-title').textContent = place.name;
    document.getElementById('modal-title-zh').textContent = place.name;
    document.getElementById('modal-address').textContent = place.formatted_address || '';
    
    let typesStr = (place.types || []).join(', ');
    typesStr = typesStr.replace(/_/g, ' ');
    document.getElementById('modal-description').textContent = typesStr;
    
    const badge = document.getElementById('modal-category');
    badge.className = `category-badge badge-${place.customCategory}`;
    badge.textContent = getCategoryName(place.customCategory);
    
    const specialtyEl = document.getElementById('modal-specialty');
    if(specialtyEl) {
        specialtyEl.querySelector('span').textContent = 
            `評価: ${place.rating || 'N/A'} (口コミ ${place.user_ratings_total || 0}件)`;
    }
    
    const phrasesContainer = document.getElementById('modal-phrases');
    phrasesContainer.innerHTML = '';
    const phrases = categoryPhrases[place.phraseType] || categoryPhrases['tourist'];
    phrases.forEach(p => {
        const li = document.createElement('li');
        li.className = 'phrase-item';
        li.innerHTML = `
            <div class="phrase-ja">${p.ja}</div>
            <div class="phrase-zh">${p.zh}</div>
            <div class="phrase-pinyin">${p.pinyin}</div>
        `;
        phrasesContainer.appendChild(li);
    });
    
    if(map && place.geometry && place.geometry.location) {
        map.panTo(place.geometry.location);
        if(map.getZoom() < 16) map.setZoom(16);
    }
    
    const mapContainer = document.getElementById('modal-nightmarket-map');
    if(place.customCategory === 'nightmarket') {
        mapContainer.style.display = 'block';
        searchAndPlotNightMarketStalls(place.geometry.location);
    } else {
        mapContainer.style.display = 'none';
        clearStallMarkers();
    }
    
    const modal = document.getElementById('detail-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function searchAndPlotNightMarketStalls(centerLocation) {
    clearStallMarkers();
    
    const request = {
        location: centerLocation,
        radius: 200, 
        type: ['food', 'restaurant']
    };

    placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            
            if(map) map.setZoom(18);

            results.forEach(stall => {
                if(!stall.geometry || !stall.geometry.location) return;

                const stallMarker = new google.maps.Marker({
                    position: stall.geometry.location,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5,
                        fillColor: '#FFB703',
                        fillOpacity: 0.9,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                    },
                    label: {
                        text: stall.name ? stall.name.substring(0, 5) : '店',
                        color: "#E65100",
                        fontSize: "10px",
                        fontWeight: "bold"
                    },
                    title: stall.name
                });
                
                stallMarkers.push(stallMarker);
            });
        }
    });
}
