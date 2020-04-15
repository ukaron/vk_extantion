function toggleGroups(e) {
    var block = document.getElementById('psychea-extra-groups');
    block.style.display = block.style.display === 'none' ? 'block' : 'none';
    e.innerText = block.style.display === 'block' ? 'Скрыть полный список' : 'Показать полный список';
}

function setUserData(userId) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.****/user/' + userId + '?fields=screen_name,MBTI,groups,IE,SN,TF,JP');
  xhr.setRequestHeader("Authorization", "Basic " + btoa("userName:Pass"));
  xhr.onload = function(result) {
    var response = JSON.parse(xhr.response);
    
    function fieldLink(name) {
      var node = document.createElement("a");
      node.className += 'extension_field';
      links = {
        INTJ: {
            url: "https://typeplanet.ru/type-descriptions/intj",
            title: "Стратег"
        },
        INTP: {
          url: "https://typeplanet.ru/type-descriptions/intp",
          title: "Ученый"
        },
        INFP: {
          url:"https://typeplanet.ru/type-descriptions/infp",
          title: "Посредник"
        },
        ISTJ: {
          url: "https://typeplanet.ru/type-descriptions/istj",
          title: "Администратор"
        },
        ISFJ: {
          url: "https://typeplanet.ru/type-descriptions/isfj",
          title: "Защитник"
        },
        ISTP: {
          url:"https://typeplanet.ru/type-descriptions/istp",
          title: "Виртуоз"
        },
        ISFP: {
          url: "https://typeplanet.ru/type-descriptions/isfp",
          title: "Артист"
        } ,
        ENTJ: {
          url:"https://typeplanet.ru/type-descriptions/entj",
          title: "Командир"
        },
        ENFJ: {
          url: "https://typeplanet.ru/type-descriptions/enfj",
          title: "Тренер"
        },
        ENTP: {
          url:"https://typeplanet.ru/type-descriptions/entp",
          title: "Полемист"
        },
        ENFP: {
          url:"https://typeplanet.ru/type-descriptions/enfp",
          title: "Борец"
        },
        ESTJ: {
          url: "https://typeplanet.ru/type-descriptions/estj",
          title: "Менеджер"
        },
        ESFJ: {
          url: "https://typeplanet.ru/type-descriptions/esfj",
          title: "Консул"
        },
        ESTP: {
          url:"https://typeplanet.ru/type-descriptions/estp",
          title: "Делец"
        },
        ESFP: {
          url: "https://typeplanet.ru/type-descriptions/esfp",
          title: "Развлекатель"
        },
      };
      var link = links[response.MBTI];
      node.setAttribute("href", link.url);
      node.innerHTML = '' +
        '<div class="clear_fix profile_info_row">' +
        '  <div class="label fl_l">'+ name + ':</div>' +
        '  <div class="labeled">' + link.title + ' (' + response.MBTI + ')' + '</div>' +
        '</div>';
      return node;
    }

    function calculation(value, name, spare) {
      var node = document.createElement("div");
      node.className += 'extension_field';
      if (value <= 50) {
        value = 100 - value;
      } else {
        name = spare;
      }
      node.innerHTML = '' +
        '<div class="clear_fix profile_info_row">' +
        '  <div class="label fl_l">'+ name + ':</div>' +
        '  <div class="labeled">' +  + Math.round(value) + '%' + '</div>' +
        '</div>';
      return node;
    }

    function getGroups(name, value) {
      var groups = [];
      if (response.groups.length > 0 & typeof value !== 'undefined') {
          groups = response.groups
              .map(function(el) {
                   return '<a href="/public' + el + '">' + el + '</a>';
              })
      }
      var node = document.createElement("div");
      node.className += 'groups';
      node.innerHTML = '' + 
      '<div class="clear_fix profile_info_row">' + 
      '  <div class="label fl_l">'+ name + ':</div>' + 
      '  <div class="labeled">' +  (groups.slice(0, 7).join(', ') || 'Нет общих групп') + '</div>' + 
      '</div>';
      
      if (groups.length > 7) {
          node.innerHTML += '<a style="margin-bottom: 5px;" class="profile_more_info_link" onclick="toggleGroups(this)">Показать полный список</a>'

          node.innerHTML += '' + 
          '<div class="clear_fix miniblock" id="psychea-extra-groups" style="display: none">' +
          '  <div class="label fl_l">&nbsp;</div>' +
          '  <div class="labeled">' + groups.slice(7).join(', ') + '</div>' +
          '</div>';
      }

      return node;
    }
    var container = document.getElementById('profile_short');
    container.prepend(getGroups('Общие группы', response.groups));

    container.prepend(calculation(response.JP, 'Иррациональность', 'Рациональность'));
    container.prepend(calculation(response.TF, 'Эмоции', 'Логика'));
    container.prepend(calculation(response.SN, 'Интуиция', 'Сенсорика'));
    container.prepend(calculation(response.IE, 'Экстраверсия', 'Интроверсия'));

    container.prepend(fieldLink('Психотип по MBTI'));
  };
  xhr.send();
}

function modifyProfile() {
  if (typeof Profile !== 'undefined' && !Profile.modified) {
      Profile.init = (function (nativeInit) {
        if (window.cur.oid) {
          setUserData(window.cur.oid)
        }

        return function(e) {
          setUserData(e.user_id)

          return nativeInit(e)
        }
      })(Profile.init)
      Profile.modified = true;
    }
}

window.onpopstate = function () {
  modifyProfile()
}

window.history.pushState = (function (nativePushState) {
  return function (a, b, c) {
    modifyProfile()
    nativePushState.apply(this, arguments)
  }
})((window.history.pushState))

modifyProfile();
