
const SUPABASE_URL = "https://mftfnidgkwfgasxlibiq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YY8Q_khpzxxWqb36tmbLpg_RPF58cPp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const dashboardMessage = document.getElementById("dashboardMessage");
const plansList = document.getElementById("plansList");
const planCount = document.getElementById("planCount");

function showMessage(element, message) {
    element.textContent = message;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function addDetail(card, label, value) {
    const paragraph = document.createElement("p");
    paragraph.className = "plan-detail";

    const strong = document.createElement("strong");
    strong.textContent = label + ": ";

    const text = document.createElement("span");
    text.textContent = value;

    paragraph.append(strong, text);
    card.appendChild(paragraph);
}


function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

function renderPlans(plans) {
    plansList.replaceChildren();
    planCount.textContent = plans.length;

    if (plans.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No date plans yet. Her next little surprise may be on its way. ♡";
        plansList.appendChild(empty);
        return;
    }

    plans.forEach((plan) => {
        const card = document.createElement("article");
        card.className = "plan-card";

        const heading = document.createElement("h3");
        heading.textContent = "♡ A little date plan";
        card.appendChild(heading);

        const date = document.createElement("p");
        date.className = "plan-detail plan-date";
        date.textContent = "📅 " + formatDate(plan.date);
        card.appendChild(date);

        addDetail(card, "Time", formatTime(plan.time));
        addDetail(card, "Activity", plan.activity);
        addDetail(
            card,
            "Food",
            Array.isArray(plan.foods) ? plan.foods.join(", ") : ""
        );

        const submitted = document.createElement("p");
        submitted.className = "submitted";
        submitted.textContent = plan.created_at
            ? "Submitted: " + new Date(plan.created_at).toLocaleString("en-PH")
            : "Submission time unavailable";

        card.appendChild(submitted);
        plansList.appendChild(card);
    });
}

async function loadPlans() {
    showMessage(dashboardMessage, "Loading your date plans...");
    plansList.replaceChildren();

    const { data, error } = await supabaseClient
        .from("date_plans")
        .select("id, date, time, activity, foods, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Could not load date plans:", error);
        showMessage(
            dashboardMessage,
            "We couldn't load your plans. Check your login and database permissions, then try refreshing."
        );
        return;
    }

    showMessage(dashboardMessage, "");
    renderPlans(data || []);
}

async function showDashboard() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        loginSection.hidden = false;
        dashboardSection.hidden = true;
        return;
    }

    loginSection.hidden = true;
    dashboardSection.hidden = false;

    await loadPlans();
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
    showMessage(loginMessage, "");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    loginButton.disabled = false;
    loginButton.textContent = "Log in ♡";

    if (error) {
        showMessage(
            loginMessage,
            "Login failed. Check your email, password, and account confirmation."
        );
        return;
    }

    document.getElementById("password").value = "";
    await showDashboard();
});

document.getElementById("logoutButton").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        showMessage(dashboardMessage, "Could not log out. Please try again.");
        return;
    }

    dashboardSection.hidden = true;
    loginSection.hidden = false;
    plansList.replaceChildren();
    planCount.textContent = "0";
    loginForm.reset();
    showMessage(loginMessage, "You have logged out.");
});

document.getElementById("refreshButton").addEventListener("click", loadPlans);

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
        loginSection.hidden = false;
        dashboardSection.hidden = true;
    }
});

showDashboard();
