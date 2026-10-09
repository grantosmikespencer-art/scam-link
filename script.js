
const invitation = document.querySelector(".invitation");

let selectedActivity = "";
let selectedFoods = [];

const activities = [
    "🍿 Movie date",
    "🌅 Sunset walk",
    "🍽️ Dinner date",
    "🕹️ Arcade date",
    "😴 Sleep together",
    "☕ Café date",
    "🌊 Beach date",
    "📸 Photo booth date",
];

const foods = [
    "🍕 Pizza",
    "🍔 Burger",
    "🍵 Coffe",
    "🍟 Fries",
    "🍦 Ice cream",
    "🍰 Cake"
];

// STEP 1: ORIGINAL INVITATION

invitation.addEventListener("click", function (event) {
    const target = event.target;

    if (target.id === "yesBtn") {
        showAccepted();
    }

    if (target.id === "noBtn") {
        const messages = [
            "Are you sure? ♡",
            "Pretty please?",
            "Think again!",
            "Give me a chance?"
        ];

        target.textContent =
            messages[Math.floor(Math.random() * messages.length)];
    }

    if (target.id === "continueBtn") {
        showPlanner();
    }

    if (target.classList.contains("activity-choice")) {
        selectedActivity = target.dataset.value;
        updateChoices(".activity-choice", selectedActivity);
    }

    if (target.classList.contains("food-choice")) {
        const food = target.dataset.value;

        if (selectedFoods.includes(food)) {
            selectedFoods = selectedFoods.filter(item => item !== food);
        } else {
            selectedFoods.push(food);
        }

        updateFoodChoices();
    }

    if (target.id === "submitPlanBtn") {
        submitPlan();
    }

    if (target.id === "backBtn") {
        showAccepted();
    }

    if (target.id === "restartBtn") {
        selectedActivity = "";
        selectedFoods = [];
        showPlanner();
    }
});

function showAccepted() {
    invitation.innerHTML = `
        <div class="heart">♥</div>
        <p class="subtitle">THE ANSWER I HOPED FOR</p>
        <h1>Yay! It's a date!</h1>
        <p class="planner-description">
            You just made me smile.
            <br>
            Let's plan our special day together.
        </p>
        <button id="continueBtn" class="primary-btn">
            Plan our date ♡
        </button>
        <p class="footer">Made with love, just for you.</p>
    `;
}

// STEP 2: DATE PLANNER

function showPlanner() {
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    invitation.innerHTML = `
        <div class="heart">💌</div>
        <p class="subtitle">JUST THE TWO OF US</p>
        <h1 class="planner-title">Plan our date</h1>
        <p class="planner-description">
            Pick what sounds fun to you, my love.
        </p>

        <div class="form-group">
            <label for="dateInput">When should our date be?</label>
            <input type="date" id="dateInput" min="${localToday}" required>
        </div>

        <div class="form-group">
            <label for="timeInput">What time works for you?</label>
            <input type="time" id="timeInput" required>
        </div>

        <div class="form-group">
            <label>What should we do together?</label>
            <div class="option-grid">
                ${activities.map(activity => `
                    <button type="button"
                        class="choice activity-choice"
                        data-value="${activity}">
                        ${activity}
                    </button>
                `).join("")}
            </div>
        </div>

        <div class="form-group">
            <label>What would you like to eat?</label>
            <p class="planner-description">
                Choose as many as you want!
            </p>
            <div class="option-grid">
                ${foods.map(food => `
                    <button type="button"
                        class="choice food-choice"
                        data-value="${food}">
                        ${food}
                    </button>
                `).join("")}
            </div>
        </div>

        <p id="errorMessage" class="error-message" role="alert"></p>

        <button id="submitPlanBtn" class="primary-btn">
            Confirm our date ♡
        </button>

        <button id="backBtn" class="secondary-btn">
            Go back
        </button>

        <p class="footer">Every date is special with you.</p>
    `;

    selectedActivity = "";
    selectedFoods = [];
}

function updateChoices(selector, selectedValue) {
    document.querySelectorAll(selector).forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.value === selectedValue
        );
    });
}

function updateFoodChoices() {
    document.querySelectorAll(".food-choice").forEach(button => {
        button.classList.toggle(
            "selected",
            selectedFoods.includes(button.dataset.value)
        );
    });
}

// STEP 3: CONFIRM THE DATE

function submitPlan() {
    const date = document.getElementById("dateInput").value;
    const time = document.getElementById("timeInput").value;
    const error = document.getElementById("errorMessage");

    if (!date || !time || !selectedActivity || selectedFoods.length === 0) {
        error.textContent =
            "Please choose a date, time, activity, and at least one food. ♡";
        return;
    }

    const chosenDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate < today) {
        error.textContent = "Please choose today or a future date. ♡";
        return;
    }

    const readableDate = chosenDate.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    invitation.innerHTML = `
        <div class="heart">💗</div>
        <p class="subtitle">OUR LITTLE PLAN</p>
        <h1>It's a plan!</h1>
        <p class="planner-description">
            Here's what you picked, my love.
        </p>

        <div class="summary">
            <p><strong>📅 Date:</strong> ${readableDate}</p>
            <p><strong>🕒 Time:</strong> ${time}</p>
            <p><strong>✨ Activity:</strong> ${selectedActivity}</p>
            <p><strong>🍓 Food:</strong> ${selectedFoods.join(", ")}</p>
        </div>

        <p class="planner-description">
            I can't wait to make more memories with you. ♡
        </p>

        <button id="restartBtn" class="primary-btn">
            Change our plans
        </button>

        <p class="footer">
            Made with all my love.
        </p>
    `;
}



/* ==================================
   FLOATING HEARTS + SCREEN TRANSITIONS
================================== */

// Create a decorative layer behind the invitation card.
const heartLayer = document.createElement("div");
heartLayer.className = "heart-particles";
heartLayer.setAttribute("aria-hidden", "true");
document.body.prepend(heartLayer);

// Use different shades and sizes for a natural look.
const heartSymbols = ["♥", "♡", "❤", "ღ"];
const heartColors = ["#e98caf", "#f2a9c5", "#d66c96", "#f5c2d7"];

function createFloatingHeart() {
    // Avoid creating unnecessary animations in a hidden tab.
    if (document.hidden) return;

    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent =
        heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    heart.style.setProperty("--left", `${Math.random() * 100}%`);
    heart.style.setProperty(
        "--heart-color",
        heartColors[Math.floor(Math.random() * heartColors.length)]
    );
    heart.style.setProperty("--heart-size", `${12 + Math.random() * 22}px`);
    heart.style.setProperty("--duration", `${7 + Math.random() * 7}s`);
    heart.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
    heart.style.setProperty("--rotation", `${-90 + Math.random() * 180}deg`);

    heartLayer.appendChild(heart);

    // Remove each heart after its animation finishes.
    heart.addEventListener("animationend", () => heart.remove(), {
        once: true
    });
}

// Start with a few hearts, then add them gradually.
for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingHeart, i * 350);
}

setInterval(createFloatingHeart, 650);

// Animate the invitation card whenever JavaScript changes its screen.
const screenObserver = new MutationObserver(() => {
    invitation.classList.remove("screen-enter");

    // Restart the CSS animation after the content changes.
    void invitation.offsetWidth;

    invitation.classList.add("screen-enter");
});

screenObserver.observe(invitation, {
    childList: true
});

// Clean up decorative hearts if the browser tab is hidden.
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        heartLayer.replaceChildren();
    } else {
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingHeart, i * 250);
        }
    }
});


/* ==================================
   SMOOTH RUNAWAY NO BUTTON
================================== */

let noButtonEscaped = false;
let lastDodgeTime = 0;

function dodgeNoButton() {
    const noBtn = document.getElementById("noBtn");

    if (!noBtn) return;

    const now = Date.now();

    // Prevent the button from jumping too frequently
    if (now - lastDodgeTime < 450) return;

    lastDodgeTime = now;

    const rect = noBtn.getBoundingClientRect();

    // Keep the button inside the visible screen
    const maxX = Math.max(16, window.innerWidth - rect.width - 16);
    const maxY = Math.max(16, window.innerHeight - rect.height - 16);

    let x;
    let y;
    let attempts = 0;

    // Choose a new position away from the current one
    do {
        x = 16 + Math.random() * Math.max(0, maxX - 16);
        y = 16 + Math.random() * Math.max(0, maxY - 16);
        attempts++;
    } while (
        attempts < 20 &&
        Math.hypot(
            x + rect.width / 2 - (rect.left + rect.width / 2),
            y + rect.height / 2 - (rect.top + rect.height / 2)
        ) < 150
    );

    if (!noButtonEscaped) {
        noBtn.classList.add("running-away");
        noBtn.style.left = `${rect.left}px`;
        noBtn.style.top = `${rect.top}px`;
        noButtonEscaped = true;

        // Allow the browser to apply the starting position first
        requestAnimationFrame(() => {
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        });
    } else {
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    }
}

// Make the button dodge when the cursor gets close
document.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;

    const noBtn = document.getElementById("noBtn");

    if (!noBtn) {
        noButtonEscaped = false;
        return;
    }

    const rect = noBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
    );

    if (distance < 90) {
        dodgeNoButton();
    }
});


/* Mobile-friendly runaway button */
document.addEventListener("touchstart", function (event) {
    const noBtn = document.getElementById("noBtn");

    if (noBtn && event.target === noBtn) {
        event.preventDefault();
        dodgeNoButton();
    }
}, { passive: false });