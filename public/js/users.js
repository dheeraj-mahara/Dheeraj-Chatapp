
let topone = document.querySelector(".topone")
let chatone = document.querySelector(".chatone")
let imageback = document.querySelector(".status-viewer-back")
let stausmodalbacak = document.querySelector(".status-modal-back")
let navItems = document.querySelectorAll(".nav-item");
let sections = document.querySelectorAll(".page-section");
let statusImage = document.getElementById("statusImage");
let previewImg = document.getElementById("previewImg");
let statusModal = document.getElementById("statusModal");
let addStatusBtn = document.getElementById("addStatusBtn");
let viewer = document.getElementById("statusViewer");
let chatno = document.querySelector(".chatno")
let statusno = document.querySelector(".statusno")
let pagesectioninmin = document.querySelector(".page-sectionmin")
let statususerdetail = document.querySelector(".status-user-detail")
let viewerImg = document.getElementById("viewerImg");
let viewerText = document.getElementById("viewerText");
let progressContainer = document.getElementById("progressContainer");
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let statusList = document.getElementById("statusList");
let users = document.getElementById("users");
let useinststus = document.querySelector("#useinststus")
let currentuserintop = document.querySelector(".currentuserintop")
const postStatusBtn = document.getElementById("postStatusBtn");
let messages = [];
let currentStatuses = [];
let currentIndex = 0;
let timer;
let imageListenerAdded = false;
const alluserdata = JSON.parse(document.getElementById("usersData").value);
let selectedImageFile = null;
let PREVIEW_IMAGE_ID = null;


navItems.forEach(btn => {
    btn.addEventListener("click", () => {
        topone.style.display = "none"
        navItems.forEach(b => b.classList.remove("active"));
        sections.forEach(sec => sec.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.dataset.target;
        document.getElementById(target).classList.add("active");
    });
});

chatone.addEventListener("click", () => {
    topone.style.display = "flex"
})
addStatusBtn.addEventListener("click", () => {
    statusModal.classList.add("active")
})
imageback.addEventListener("click", () => {
    viewer.classList.remove("active")
    if (window.innerWidth >= 767) {
        statusno.style.display = "flex"
    }
    currentuserintop.style.display = "block"
    useinststus.innerHTML = ""
})
stausmodalbacak.addEventListener("click", () => {
    statusModal.classList.remove("active");
})

previewImg.addEventListener("click", () => {
    statusImage.click();
});

statusImage.addEventListener("change", () => {
    const file = statusImage.files[0];
    if (!file) return;


    previewImg.src = URL.createObjectURL(file);
    previewImg.style.border = "none";

});

document.querySelectorAll(".status-item").forEach(item => {

    item.onclick = () => {

        let statususername = item.getAttribute("data-username")
        currentStatuses = JSON.parse(item.dataset.statuses);
        currentIndex = 0;

        createProgressBars();
        showStatus(currentIndex);

        viewer.classList.add("active");
        statusno.style.display = "none"
        currentuserintop.style.display = "none"
        useinststus.innerHTML = statususername

    };
});

postStatusBtn.onclick = async function () {

    const btn = this;
    const btnText = btn.querySelector(".btn-text");
    const loader = btn.querySelector(".loader");

    const file = statusImage.files[0];
    const text = document.getElementById("statusText").value;

    if (!file && !text) return;

    btn.disabled = true;
    btnText.classList.add("hidden");
    loader.classList.remove("hidden");

    try {
        const form = new FormData();
        form.append("image", file);
        form.append("text", text);

        const res = await fetch("/status/add", {
            method: "POST",
            body: form
        });

        const data = await res.json();

        if (data.success) {
            addStatusToUI(data.status);
            document.getElementById("statusText").value = "";
            previewImg.src = "/image/image.png"
            previewImg.style.border = "2px dashed #ccc";
            statusModal.classList.remove("active");
        }

    } catch (err) {
        console.error(err);
        alert("Status upload failed");
    } finally {
        btn.disabled = false;
        btnText.classList.remove("hidden");
        loader.classList.add("hidden");
    }
};

document.addEventListener('DOMContentLoaded', function () {
    loadStatus()
});

async function loadStatus() {
    const res = await fetch("/status/all");
    const data = await res.json();

}

// status work

function createProgressBars() {
    progressContainer.innerHTML = "";
    currentStatuses.forEach(() => {
        const bar = document.createElement("div");
        bar.className = "progress";
        bar.innerHTML = "<span></span>";
        progressContainer.appendChild(bar);
    });
}

function showStatus(index) {

    clearInterval(timer);
    let statusimgouter = document.querySelector(".status_img_outer")
    const status = currentStatuses[index];
    viewerText.style.display = "none";

    statusimgouter.style.display = "none";

    if (status.image) {
         let statustime = (
            new Date(status.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        );
   statususerdetail.innerHTML = `
<p class="statustime">${statustime} </p>
`
        viewerImg.src = status.image;
        statusimgouter.style.display = "flex";


    }

    if (status.text) {

        let statustime = (
            new Date(status.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        );

        statususerdetail.innerHTML = `
<p class="statustime">${statustime} </p>
`
        viewerText.innerText = status.text;
        viewerText.style.display = "block";

    }

    animateProgress(index);
}

function animateProgress(index) {
    const bars = document.querySelectorAll(".progress span");
    bars.forEach((bar, i) => {
        bar.style.width = i < index ? "100%" : "0%";
    });

    let width = 0;
    timer = setInterval(() => {
        width += 1;
        bars[index].style.width = width + "%";

        if (width >= 100) {
            clearInterval(timer);
            nextStatus();
        }
    }, 20);
}

function nextStatus() {
    if (currentIndex < currentStatuses.length - 1) {
        currentIndex++;
        showStatus(currentIndex);

    } else {
        viewer.classList.remove("active");
        if (window.innerWidth >= 767) {
            statusno.style.display = "flex"
        }
        currentuserintop.style.display = "block"
        useinststus.innerHTML = ""
    }
}

function prevStatus() {
    if (currentIndex > 0) {
        currentIndex--;
        showStatus(currentIndex);
    }
}

nextBtn.onclick = () => {

    if (currentIndex < currentStatuses.length - 1) {
        currentIndex++;
        showStatus(currentIndex);

    }

};

prevBtn.onclick = () => {

    if (currentIndex > 0) {
        currentIndex--;
        showStatus(currentIndex);
    }

};

function addStatusToUI(userStatus) {


    const userId = userStatus.userId;
    const statuses = userStatus.statuses;

    // latest status
    const latestStatus = statuses[0];

    let existingItem = [...statusList.children].find(item => {

        return item.getAttribute("data-owner") === userStatus.userId;
    });


    if (existingItem) {
        existingItem.dataset.statuses = JSON.stringify(statuses);

        const circle = existingItem.querySelector(".status-circle");
        circle.innerHTML = latestStatus.image
            ? `<img src="${latestStatus.image}" class="bimg">`
            : `<p class="status-text-placeholder btext">${latestStatus.text}</p>`;

        statusList.prepend(existingItem);

    } else {
        const div = document.createElement("div");
        div.className = "status-item";
        div.dataset.userId = userId;
        div.dataset.statuses = JSON.stringify(statuses);

        div.innerHTML = `
            <div class="status-circle">
                ${latestStatus.image
                ? `<img src="${latestStatus.image}" class="bimg">`
                : `<p class="status-text-placeholder btext">${latestStatus.text}</p>`
            }
            </div>
            <p class="status-user">"My Status"</p>
        `;


        div.onclick = () => {


            currentStatuses = statuses;
            currentIndex = 0;
            createProgressBars();
            showStatus(currentIndex);
            viewer.classList.add("active");
            statusno.style.display = "none"

            currentuserintop.style.display = "none"
            useinststus.innerHTML = statususername
        };

        statusList.prepend(div);
    }
}




function logout() {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "/auth/logout";
    }
}
let currentReceiverId = null;
let currentRoomId = null;

let socket;
let CURRENT_USER_ID;
const chatBox = document.querySelector(".allchat");



// Example

function renderChatList(list) {
    console.log();
    

    const container = document.getElementById("alluserlist");
    container.innerHTML = "";

    list.forEach(user => {

        const matchedUser = alluserdata.find(
            u => u.id === user.contactId
        );
        const userName = matchedUser?.name;
        const lastMsg = user.lastMessage || "No messages yet";
        container.innerHTML += `
        <div id="user-${user.contactId}"
            data-owner="${user.contactId}"
            data-username="${userName}"
            class="chat_mem"
            onclick="openChat('${user.contactId}')"
            style="text-decoration:none;color:inherit;">

            <div class="chat_img">
                <img src="/image/image.png" height="100%" width="100%">
            </div>

            <div class="chat_text">
                 <h5 class="${userName ? "" : "name-loading"}">
        ${userName || ""}
    </h5>
                <p>
                    ${lastMsg.length > 20
                ? lastMsg.substring(0, 20) + "..."
                : lastMsg}
                </p>
            </div>

            <span class="status-dot ${user.online ? "online" : "offline"}"></span>

            <div class="chat_time">
                <p style="font-size:11px;color:#213293;">
                    ${new Date(user.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
                </p>
            </div>

        </div>
        `;
    });
}
function initSocket(currentUserId) {
    if (socket) return socket;

    CURRENT_USER_ID = currentUserId;
    socket = io({
        auth: { userId: currentUserId }
    });

    socket.emit("userOnline", { userId: currentUserId });

    socket.on("updateUserStatus", (data) => {


        const userRow = document.getElementById(`user-${data.userId}`);
        if (!userRow) return;

        const dot = userRow.querySelector(".status-dot");
        if (dot) {
            dot.className = data.online
                ? "status-dot online"
                : "status-dot offline";
        }
    });

    socket.on("chatListUpdated", (updatedList) => {
        renderChatList(updatedList);
    });


    socket.on("newMessage", (msg) => {

        // if (document.querySelector(`[data-id="${msg._id}"]`)) return;
        messages.push(msg);
        renderMessages(messages);
    });
    return socket;
}
let TEMP_IMAGE_ID = null;



function removePreview() {
    document.getElementById(PREVIEW_IMAGE_ID)?.remove();
    selectedImageFile = null;
    PREVIEW_IMAGE_ID = null;
}

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    selectedImageFile = file;
    PREVIEW_IMAGE_ID = "preview_" + Date.now();

    const previewURL = URL.createObjectURL(file);

    chatBox.insertAdjacentHTML(
        "beforeend",
        `<div class="send image-preview" id="${PREVIEW_IMAGE_ID}">
            <img src="${previewURL}" class="preview-img"/>
            <span class="remove-img" onclick="removePreview()">✖</span>
        </div>`
    );

    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("attach-toggle").checked = false;
});
function initChat(receiverId) {
    currentReceiverId = receiverId;

    const senderId = CURRENT_USER_ID;
    currentRoomId =
        senderId < receiverId
            ? `${senderId}_${receiverId}`
            : `${receiverId}_${senderId}`;

    socket.emit("joinRoom", { roomId: currentRoomId });
}

const input = document.querySelector(".message");
sendBtn.addEventListener("click", handleSend);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});

function handleSend() {
    const text = input.value.trim();

    if (!text && !selectedImageFile) return;

    if (PREVIEW_IMAGE_ID) {
        const previewDiv = document.getElementById(PREVIEW_IMAGE_ID);
        previewDiv.innerHTML = `<div class="chat-loader">Sending image...</div>`;
        previewDiv.id = "sending_" + Date.now();
    }

    sendChatMessage({
        text,
        file: selectedImageFile
    });

    input.value = "";
    selectedImageFile = null;
    PREVIEW_IMAGE_ID = null;
}

async function sendChatMessage({ text = "", file = null }) {

    if (!currentReceiverId) return;
    if (!text && !file) return;


    const formData = new FormData();
    if (text) formData.append("message", text);
    if (file) formData.append("image", file);

    const res = await fetch(`/chat/${currentReceiverId}/message`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    renderChatList(data.senderList);

    socket.emit("message", {
        savedMessage: data.savedMessage,
        receiverList: data.receiverList,
        roomId: currentRoomId,
        to: currentReceiverId,
    });


    input.value = "";
    selectedImageFile = null;
}

document.querySelector(".Chat-modal-back").addEventListener("click", () => {
    document.getElementById("chatArea").style.display = "none";
    if (window.innerWidth <= 767) {
        let leftfirst = document.querySelector(".leftfirst")
        leftfirst.style.display = "none"


    }
    document.getElementById("chats-section").classList.add("active");
    document.getElementById("bottomnav").style.display = "flex";
    document.querySelector(".upper_section").style.display = "block"
    pagesectioninmin.style.display = "block";
})

function openChat(receiverId) {
    if (!receiverId || receiverId === "undefined") {
        return;
    }

    chatno.style.display = "none"
    if (window.innerWidth <= 767) {

        pagesectioninmin.style.display = "none"

        document.getElementById("bottomnav").style.display = "none";
        document.querySelector(".upper_section").style.display = "none"
    }
    document.getElementById("chatArea").style.display = "block";
    let leftfirst = document.querySelector(".leftfirst")
    leftfirst.style.display = "block"





    fetch(`/chat/${receiverId}/data`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("chatUserName").innerText =
                data.receiver.receiverUser.name;

            messages = data.messages;
            renderMessages(messages);

            initChat(receiverId);
        });
}

function nextImage() {
    imagecurrentIndex = (imagecurrentIndex + 1) % images.length;
    document.querySelector(".left").style.display = "block";


    if (imagecurrentIndex == images.length - 1) {

        document.querySelector(".right").style.display = "none";

    }

    updateImage();
}

function prevImage() {
    document.querySelector(".right").style.display = "block";

    imagecurrentIndex =
        (imagecurrentIndex - 1 + images.length) % images.length;
    if (imagecurrentIndex == 0) {
        document.querySelector(".left").style.display = "none";

    }


    updateImage();
}

function updateImage() {
    document.querySelector(".image-modal img").src =
        images[imagecurrentIndex];
}

function addSwipe(modal) {
    let startX = 0;
    let endX = 0;

    modal.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    modal.addEventListener("touchend", e => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        if (startX - endX > 50) {
            nextImage(); // swipe left
        } else if (endX - startX > 50) {
            prevImage(); // swipe right
        }
    }
}

function showImageFull() {

    let modal = document.querySelector(".image-modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.className = "image-modal";
        modal.innerHTML = `
            <span class="nav left">&#10094;</span>
            <div class="image-wrapper">
                <img>
            </div>
            <span class="nav right">&#10095;</span>
        `;
        document.querySelector(".first_page_outer").appendChild(modal)

        modal.querySelector("img").addEventListener("click", () => {
            modal.style.display = "none";
        });



        modal.querySelector(".left").onclick = prevImage;
        modal.querySelector(".right").onclick = nextImage;

        addSwipe(modal);
    }

    modal.querySelector("img").src = images[imagecurrentIndex];
    modal.style.display = "flex";
}

let images = [];
let imagecurrentIndex = 0;

function renderMessages(messages) {
    const box = document.querySelector(".allchat");
    box.innerHTML = ""


    box.addEventListener("click", function (e) {
        const img = e.target.closest(".chat-image img");
        if (!img) return;

        images = Array.from(
            box.querySelectorAll(".chat-image img")
        ).map(i => i.src);

        imagecurrentIndex = images.indexOf(img.src);

        showImageFull();
    });

    messages.forEach(msg => {

        const isSender = String(msg.senderId) === String(CURRENT_USER_ID);

        box.insertAdjacentHTML(
            "beforeend",
            `<div class="${isSender ? "send" : "recive"} chat-wrapper" data-id="${msg._id}">
       
       ${msg.message ? `<p class="chats">${msg.message}</p>` : ""}

       ${msg.imageUrl ? `
          <div class="chat-image">
             <img src="${msg.imageUrl}" height="100%" width="100%">
          </div>` : ""
            }

${isSender ? `
  <span class="delete-btn" title="Delete message">
    🗑
  </span>
` : ""}
       <p class="chattime">${msg.time}</p>        
    </div>`
        );

        chatBox.scrollTop = chatBox.scrollHeight;
        if (isSender) {
            const deleteBtn = box.querySelector(`[data-id="${msg._id}"] .delete-btn`);

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    deleteMessage(msg._id);
                });
            }
        }

    });

}




async function deleteMessage(messageId) {
    try {
        const res = await fetch(`/chat/message/${messageId}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.success) {
            const messageElement = document.querySelector(
                `.chat-wrapper[data-id="${messageId}"]`
            );
            let otherMess = messages.filter(m => m._id != messageId)
            messages = otherMess
            if (messageElement) messageElement.remove();
        }

    } catch (err) {
        console.error("Delete failed", err);
    }
}

function sendImageToServer(file, roomId, senderId, receiverId) {

    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", roomId);
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);

    fetch(`/chat/${receiverId}/message`, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            // socket.emit("sendImage", {
            //     senderId,
            //     to: receiverId,
            //     roomId,
            //     imageUrl: data.imageUrl,
            //     time: data.time
            // });
        });
}


//  -==--= loading work  -=-==-=
function showImageLoader(tempId) {
    const chatBox = document.querySelector(".allchat");

    chatBox.insertAdjacentHTML(
        "beforeend",
        `<div class="send" id="${tempId}">
        <div class="chat-loader">Uploading image</div>
     </div>`
    );

    chatBox.scrollTop = chatBox.scrollHeight;
}



// -==============================-      user serch system  -===========


const searchInput = document.querySelector(".search_chat");
const resultBox = document.querySelector(".search_results");

searchInput.addEventListener("keyup", async () => {
    const q = searchInput.value.trim();

    if (q === "") {
        resultBox.innerHTML = "";
        return;
    }

    const res = await fetch(`/users/search?q=${q}`);
    const users = await res.json();


    resultBox.innerHTML = "";

    if (users.length === 0) {
        resultBox.innerHTML = '<p style="color:#0e2579; text-align:center;">No user found</p>';
        return;
    }


    users.forEach(user => {

        const div = document.createElement("div");
        div.classList.add("search-user");

        div.innerHTML = `
        <div class="user-info">
            <h4 class="user-name">${user.name}</h4>
            <p class="user-contact">${user.contact}</p>
        </div>
        <button class="view-btn">View</button>
`;


        div.onclick = () => {
            openChat(user._id);
            resultBox.innerHTML = ""
        };


        resultBox.appendChild(div);
    });
});