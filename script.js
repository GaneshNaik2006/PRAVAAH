import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------- FIREBASE CONFIG ---------------------- */
    const firebaseConfig = {
        apiKey: "AIzaSyCbXKleOw4F46gFDXz2Wynl3YzPuHsVwh8",
        authDomain: "pravaah-55b1d.firebaseapp.com",
        projectId: "pravaah-55b1d",
        storageBucket: "pravaah-55b1d.appspot.com",
        messagingSenderId: "287687647267",
        appId: "1:287687647267:web:7aecd603ee202779b89196"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    /* ---------------------- LOGOUT HANDLER ---------------------- */
    const logoutDesktop = document.getElementById("logoutDesktop");
    const logoutMobile = document.getElementById("logoutMobile");

    function handleLogout() {
        signOut(auth)
            .then(() => {
                // IMPORTANT: Ensure this redirects to your login page name
                window.location.href = "index.html"; 
            })
            .catch((error) => {
                alert("Error logging out: " + error.message);
            });
    }

    if (logoutDesktop) logoutDesktop.addEventListener("click", handleLogout);
    if (logoutMobile) logoutMobile.addEventListener("click", handleLogout);

    /* ---------------------- CALENDAR + FEED LOGIC ---------------------- */
    const monthYear = document.getElementById("monthYear");
    const calendar = document.getElementById("calendar");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    const feedList = document.getElementById("feedList");

    let currentDate = new Date();

    // 💡 CORRECTION: Added sample events for November 2025 and a 'No Events' placeholder.
    const feedsByDate = {
        "2025-11-07": [
            { img: "DSC09133.JPG", name: "Pravaah", text: "2nd Edition Launch Ceremony", time: "11:59" }
        ],
        // Sample event for a day you click in the image
        "2025-11-15": [ 
             { img: "DSC09133.JPG", name: "Star Night", text: "Performance by Sunidhi Chauhan", time: "19:30" }
        ],
        // Sample event for another day
        "2025-11-20": [
             { img: "DSC09133.JPG", name: "Hackathon", text: "24-Hour Code Challenge Begins", time: "10:00" },
             { img: "DSC09133.JPG", name: "Robo-Race", text: "Final Round Eliminations", time: "15:00" }
        ]
    };

    const defaultFeed = [
        { img: "DSC09133.JPG", name: "Pravaah", text: "No Major Events Scheduled", time: "--:--" }
    ];

    function renderFeed(dateKey) {
        feedList.classList.add("fade-out");

        setTimeout(() => {
            feedList.innerHTML = "";
            // Use the date-specific data, or the default feed if the key isn't found
            const data = feedsByDate[dateKey] || defaultFeed; 

            data.forEach(feed => {
                const item = document.createElement("div");
                item.classList.add("feed-item");

                item.innerHTML = `
                    <img src="${feed.img}" alt="${feed.name}">
                    <div class="feed-details">
                        <h4>${feed.name}</h4>
                        <p>${feed.text}</p>
                    </div>
                    <div class="feed-time">${feed.time}</div>
                `;

                feedList.appendChild(item);
            });

            feedList.classList.remove("fade-out");
            feedList.classList.add("fade-in");

            setTimeout(() => feedList.classList.remove("fade-in"), 600);
        }, 300);
    }

    function renderCalendar(date, transition = false) {
        const year = date.getFullYear();
        const month = date.getMonth();

        if (transition) calendar.classList.add("fade-out");

        setTimeout(() => {
            monthYear.innerText = `${date.toLocaleString("default", {
                month: "long"
            })} ${year}`;

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            calendar.innerHTML = "";

            for (let i = 0; i < firstDay; i++) {
                calendar.appendChild(document.createElement("div"));
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement("div");
                day.classList.add("day");
                day.innerText = i;

                const today = new Date();
                const currentDayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;


                // Highlight days that have events
                if (feedsByDate[currentDayKey]) {
                    day.style.border = "2px solid #ff00ff"; // Event Day highlight
                    day.style.boxShadow = "0 0 10px rgba(255, 0, 255, 0.5)"; 
                }

                if (
                    i === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                ) {
                    day.classList.add("today");
                }

                day.addEventListener("click", (e) => {
                    document.querySelectorAll(".day").forEach(d =>
                        d.classList.remove("selected")
                    );
                    e.target.classList.add("selected");

                    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
                    renderFeed(key);
                });

                calendar.appendChild(day);
            }

            if (transition) {
                calendar.classList.remove("fade-out");
                calendar.classList.add("fade-in");
                setTimeout(() => calendar.classList.remove("fade-in"), 600);
            }
        }, transition ? 300 : 0);
    }

    prevMonth.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate, true);
    };

    nextMonth.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate, true);
    };

    renderCalendar(currentDate);

    // 💡 CORRECTION: Initial feed render should show today's feed (or the default/empty feed)
    const initialKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
    renderFeed(initialKey);


    /* ---------------------- VIDEO SWITCH ---------------------- */
    const mainVideo = document.getElementById("mainVideo");
    const aftermovieBtn = document.getElementById("aftermovieBtn");
    const themeBtn = document.getElementById("themeBtn");

    if (mainVideo && aftermovieBtn && themeBtn) {
        aftermovieBtn.addEventListener("click", () => {
            mainVideo.src = "aftermovie.mp4";
            aftermovieBtn.classList.add("active");
            themeBtn.classList.remove("active");
        });

        themeBtn.addEventListener("click", () => {
            mainVideo.src = "themevideo.mp4";
            themeBtn.classList.add("active");
            aftermovieBtn.classList.remove("active");
        });
    }

    /* ---------------------- MOBILE NAV MENU (FIXED) ---------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menu.classList.remove("active");
            }
        });

        document.querySelectorAll("#menu a").forEach(link => {
            link.addEventListener("click", () => menu.classList.remove("active"));
        });
    }
});