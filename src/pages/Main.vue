<script setup lang="ts">

import MyCard from "@/components/ACCard.vue";
import ACCardSubtitle from "@/components/ACCardSubtitle.vue";
import {Animals} from "@/assets/animals";
import {versions} from "@/assets/data/versions";
import {ref} from "vue";
import {createEvents, EventAttributes} from 'ics';
import {useDisplay} from "vuetify";

let selectedVersion = ref(12);
let selectedAnimals = ref([]);
let animalRule = ref("{年份}年{小动物的名字}生日")
let activityRule = ref("{年份}年{活动的名字}");
let exportYears = ref(5);
let showAboutDialog = ref(false);
let showGuideDialog = ref(false);
let showTroubleshootDialog = ref(false);
let troubleshootPage = ref(0);
let troubleshootItem = ref(0);
let showCopyICSContentSnackbar = ref(false);

let ICSContent = ref("");

const troubleshootItems = ["我无法下载日历文件", "我找不到下载的日历文件", "我不知道如何导入日历文件"]

const animalRuleDefault = "{年份}年{小动物的名字}生日";
const activityRuleDefault = "{年份}年{活动的名字}";

const dependenciesList = [
  {
    name: "狸家 Nookea",
    description: '动森送礼指南（集合啦！动物森友会）',
    icon: 'mdi-web',
    link: 'https://nookea.com/'
  },
  {
    name: "Vuetify",
    description: '基于 Material Design 的 Vue.js 组件库',
    icon: 'mdi-package-variant',
    link: 'https://vuetifyjs.com/'
  },
  {
    name: "ics.js",
    description: '前端 iCalendar 文件生成库',
    icon: 'mdi-package-variant',
    link: 'https://github.com/adamgibbons/ics'
  },
]

function useDesktopMode() {
  const breakpoint = useDisplay();
  switch (breakpoint.name.value) {
    case 'xs':
      return false
    case 'sm':
      return false
    case 'md':
      return true
    case 'lg':
      return true
    case 'xl':
      return true
    case 'xxl':
      return true
  }
}

function openURLInNewTab(url: string): void {
  window.open(url);
}

function getAnimalEventName(animalName: string, year: number): string {
  return animalRule.value.replaceAll("{小动物的名字}", animalName).replaceAll("{年份}", year.toString());
}

function getActivityEventName(activity: string, year: number): string {
  return activityRule.value.replaceAll("{活动的名字}", activity).replaceAll("{年份}", year.toString());
}

async function generateICS(): Promise<string> {
  return new Promise((resolve, reject) => {
    const events: EventAttributes[] = [];
    for (const name of selectedAnimals.value) {
      const animal = Animals.getByName(name);
      if (animal) {
        for (let i = 0; i < exportYears.value; i++) {
          const date = new Date(new Date().getFullYear() + i, animal.birthMonth - 1, animal.birthDate);
          const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
          events.push({
            title: getAnimalEventName(animal.name, date.getFullYear()),
            start: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
            end: [nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()],
          });
        }

      }
    }
    createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    })
  })
}

async function generateAndDownloadICS() {
  const fileName = 'acnh.ics';
  const content = await generateICS();
  const file = new File([content], fileName, {type: 'text/calender'})

  const url = URL.createObjectURL(file);

  // trying to assign the file URL to a window could cause cross-site issues so this is a workaround using HTML5
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

async function displayTroubleshootDialog() {
  ICSContent.value = await generateICS();
  showTroubleshootDialog.value = true;

}

function copyICSContent() {

  const clipboardObject = navigator.clipboard;
  clipboardObject.writeText(ICSContent.value)
    .then(() => {
      showCopyICSContentSnackbar.value = true
    });
}

</script>

<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="12" md="6" class="mx-2 mx-md-4 mt-16 mb-0 mt-md-16">
        <p class="text-h2 text-md-h2 ac-text-headline" :style="useDesktopMode() ? {} : {width: 'min-content'}">Nook
          Calendar</p>
        <p class="text-subtitle-2 text-md-subtitle-1 ac-text-subtitle">记录岛屿活动和小动物的生日，并保存为日历文件。</p>
      </v-col>
      <v-col cols="12" md="4" class="mx-2 mx-md-4 mt-0 mb-0 mt-md-16">
        <v-row v-if="useDesktopMode()">
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-lightbulb-variant"
                   @click="showGuideDialog = true">
              教程
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-information-outline"
                   @click="showAboutDialog = true">
              关于
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-github"
                   @click="openURLInNewTab('https://github.com/ssYanhuo/animal-crossing-calendar')">
              GitHub
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852"
                   prepend-icon="mdi-book-open-variant-outline" @click="openURLInNewTab('https://nookea.com/')">
              狸家
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="!useDesktopMode()">
          <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852"
                 prepend-icon="mdi-lightbulb-variant" @click="showGuideDialog = true">
            教程
          </v-btn>
          <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852"
                 prepend-icon="mdi-information-outline" @click="showAboutDialog = true">
            关于
          </v-btn>
          <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852"
                 prepend-icon="mdi-github"
                 @click="openURLInNewTab('https://github.com/ssYanhuo/animal-crossing-calendar')">
            GitHub
          </v-btn>
          <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852"
                 prepend-icon="mdi-open-in-new" @click="openURLInNewTab('https://nookea.com/')">
            狸家
          </v-btn>
        </div>


      </v-col>

    </v-row>

    <v-row>
      <v-col cols="12" md="4" class="px-md-4 px-0">
        <MyCard>
          <template v-slot:title>
            全局配置
          </template>
          <ACCardSubtitle>
            游戏设置
          </ACCardSubtitle>
          <v-select
            v-model="selectedVersion"
            label="游戏版本"
            variant="outlined"
            :items="versions"
            item-title="name"
            item-value="value"
          >
          </v-select>

          <ACCardSubtitle>
            导出设置
          </ACCardSubtitle>
          <v-text-field
            spellcheck="false"
            class="mb-6"
            :messages="`e.g. ${getActivityEventName('万圣节', new Date().getFullYear())}`"
            v-model="activityRule"
            variant="outlined"
            label="岛屿活动的命名规则"
            clearable
            clear-icon="mdi-refresh"
            @click:clear="activityRule = activityRuleDefault"
          >
          </v-text-field>
          <v-text-field
            spellcheck="false"
            class="mb-6"
            :messages="`e.g. ${getAnimalEventName('蜜雪儿', new Date().getFullYear())}`"
            v-model="animalRule"
            variant="outlined"
            label="小动物生日的命名规则"
            clearable
            clear-icon="mdi-refresh"
            @click:clear="animalRule = animalRuleDefault"
          >
          </v-text-field>
          <v-number-input
            v-model="exportYears"
            label="导出年限"
            :hideInput="false"
            :inset="false"
            variant="outlined"
            :min="1"
            :max="5"
          >

          </v-number-input>
        </MyCard>
      </v-col>
      <v-col cols="12" md="8" class="px-md-4 px-0">
        <MyCard>
          <template v-slot:title>
            岛屿活动
          </template>
          <ACCardSubtitle>
            快速搜索
          </ACCardSubtitle>
          <v-select
            disabled
            label="即将到来……"
            variant="outlined"
            :items="['1', '2']">
          </v-select>
        </MyCard>
        <MyCard>
          <template v-slot:title>
            小动物
          </template>
          <ACCardSubtitle>
            快速搜索
          </ACCardSubtitle>
          <v-combobox
            clearable
            closable-chips
            chips
            multiple
            prepend-inner-icon="mdi-magnify"
            label="已选择的小动物"
            variant="outlined"
            placeholder="键入以快速搜索"
            :items="Animals.getNames(12)"
            v-model="selectedAnimals"
          >

          </v-combobox>

          <v-item-group multiple v-model="selectedAnimals">

            <v-container class="pa-0">
              <v-row
                v-for="(specie, i) in Animals.groupBySpecie()"
                :key="i"
              >
                <v-col cols="12" class="pb-0">
                  <ACCardSubtitle>
                    {{ '物种：' + specie[0] }}
                  </ACCardSubtitle>
                </v-col>
                <v-col
                  v-if="useDesktopMode()"
                  v-for="(animal, i) in specie[1]"
                  :key="i"
                  cols="4"
                  md="2"
                  xl="1"
                >
                  <v-item v-slot="{ isSelected, toggle }" :value="animal.name">
                    <v-card
                      v-tooltip:bottom="`生日：${animal.birthMonth}月${animal.birthDate}日`"
                      :ripple="false"
                      :color="isSelected ? 'primary' : ''"
                      class="align-center pa-2"
                      variant="outlined"
                      :style="isSelected ? {backgroundColor: '#98685244'} : {backgroundColor: '#ffffff88'} "
                      @click="toggle"
                    >
                      <div
                        class="text-center"
                      >
                        <v-icon v-if="isSelected" size="xs" class="check-icon">mdi-check-circle</v-icon>
                        <v-img :src="animal.avatar">

                        </v-img>
                        {{ animal.name }}
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col cols="12" v-if="!useDesktopMode()" class="mb-4">
                  <v-slide-group multiple mobile :show-arrows="false">
                    <v-item
                      v-for="(animal, i) in specie[1]"
                      :key="i"
                      v-slot="{ isSelected, toggle }"
                      :value="animal.name">
                      <v-card
                        height="88"
                        width="64"
                        v-tooltip:bottom="`生日：${animal.birthMonth}月${animal.birthDate}日`"
                        :ripple="false"
                        :color="isSelected ? 'primary' : ''"
                        class="align-center pa-1 mx-1"
                        variant="outlined"
                        :style="isSelected ? {backgroundColor: '#98685244'} : {backgroundColor: '#ffffff88'} "
                        @click="toggle"
                      >
                        <div
                          class="text-center"
                        >
                          <v-icon v-if="isSelected" size="xs" class="check-icon">mdi-check-circle</v-icon>
                          <v-img :src="animal.avatar">

                          </v-img>
                          <p class="text-subtitle-2">{{ animal.name }}</p>
                        </div>
                      </v-card>
                    </v-item>
                  </v-slide-group>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </MyCard>

      </v-col>
    </v-row>
    <v-speed-dial location="bottom end" transition="fade-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-if="useDesktopMode()"
               position="sticky"
               prepend-icon="mdi-check"
               class="me-16 mb-4"
               size="x-large"
               app
               appear
               color="secondary"
               rounded
               @click="generateAndDownloadICS"
               v-bind="activatorProps"
               text="生成"
        >
        </v-fab>
        <v-fab v-if="!useDesktopMode()"
               position="sticky"
               icon="mdi-check"
               class="me-16 mb-4"
               size="large"
               app
               appear
               color="secondary"
               @click="generateAndDownloadICS"
               v-bind="activatorProps"
        >
        </v-fab>
      </template>
      <v-btn key="1" rounded prepend-icon="mdi-help-circle-outline" color="primary"
             @click="displayTroubleshootDialog">遇到问题？
      </v-btn>
    </v-speed-dial>

    <v-dialog
      v-model="showGuideDialog"
      width="auto"
      scrollable
    >
      <v-card
        style="color: #986852 !important;"
        color="background"
        variant="flat"
        max-width="600"
        max-height="600"
        prepend-icon="mdi-lightbulb-variant"
        title="如何使用"
        rounded="xl"
      >

        <v-card-text>
          <div>
            <p class="mb-4">
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
              选择想要添加到日历的活动和小动物生日
            </p>
            <p class="mb-4">
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
              生成并下载日历文件
            </p>
            <p class="mb-4">
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon>
              添加日历文件到日历 App
            </p>
          </div>

          <v-img src="@/assets/guide.gif" max-height="400"></v-img>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="好"
            @click="showGuideDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showAboutDialog"
      width="auto"
      scrollable
    >
      <v-card
        style="color: #986852 !important;"
        color="background"
        variant="flat"
        max-width="600"
        max-height="600"
        prepend-icon="mdi-information-outline"
        title="关于"
        rounded="xl"
      >

        <v-card-text>
          <p class="mb-2" :style="{color: '#A72A2D !important'}">开发者：</p>
          <v-list-item class="px-0" @click="openURLInNewTab('https://github.com/ssYanhuo')">
            <template v-slot:prepend>
              <v-avatar>
                <v-img src="/images/avatar.jpg">

                </v-img>
              </v-avatar>
            </template>
            <v-list-item-title>ssYanhuo</v-list-item-title>
            <v-list-item-subtitle>前往我的 GitHub 主页</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2"></v-divider>

          <p class="mb-2" :style="{color: '#A72A2D !important'}">Nook Calendar 离不开以下项目的支持：</p>
          <v-list-item v-for="(dependency, i) in dependenciesList" :key="i" class="px-0"
                       @click="openURLInNewTab(dependency.link)">
            <template v-slot:prepend>
              <v-icon :style="{color: '#A72A2D !important'}">{{ dependency.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ dependency.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ dependency.description }}</v-list-item-subtitle>
          </v-list-item>

        </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="好"
            @click="showAboutDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-snackbar
      class="mb-8"
      v-model="showCopyICSContentSnackbar"
      rounded="xl"
      width="100"
    >
      已复制内容到剪贴板
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showCopyICSContentSnackbar = false"
        >
          好
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="showTroubleshootDialog"
      width="auto"
      scrollable
    >
      <v-card
        style="color: #986852 !important;"
        color="background"
        variant="flat"
        max-width="600"
        max-height="600"
        :title="troubleshootPage === 0 ? '疑难解答' : troubleshootItems[troubleshootItem]"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-icon v-if="troubleshootPage === 0">mdi-help-circle-outline</v-icon>
          <v-btn variant="text" v-else icon="mdi-arrow-left" @click="troubleshootPage = 0" density="compact"></v-btn>
        </template>

        <v-card-text class="py-0">
          <v-window
            v-model="troubleshootPage"
          >

            <v-window-item>
              <v-list bg-color="transparent" class="py-0" density="compact">
                <v-list-item
                  v-for='(item, i) in troubleshootItems'
                  :key="i"
                  @click="troubleshootItem = i; troubleshootPage = 1"
                  append-icon="mdi-arrow-right"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-avatar density="compact">
                      <v-icon :style="{color: '#A72A2D !important'}">mdi-help-circle</v-icon>
                    </v-avatar>
                  </template>
                  <p>{{ item }}</p>
                </v-list-item>
              </v-list>
            </v-window-item>

            <v-window-item>
              <div v-if='troubleshootItem === 0' class="px-0">
                <p class="mb-4">Nook Calendar 使用了一些较新但仍在标准之内，理应得到完整支持的浏览器特性，这使得 Nook
                  Calendar
                  可以完全在浏览器本地运行，而不需要后端服务。</p>
                <p class="mb-4">
                  不幸的是，尽管这些特性已经发布并应用多年，部分移动设备的浏览器对这些特性的支持并不完善。</p>
                <p class="mb-4">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
                  你可以更换一款符合现代标准的浏览器，比如 Google Chrome、Safari 或者 Edge。
                </p>
                <p class="mb-4">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
                  你也可以用计算机的浏览器生成并下载日历文件后，把它发送到你的移动设备来使用。
                </p>
                <p class="mb-8">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon>
                  或者作为替代方案，你还可以<a href="javascript:void(0);" style="color: #A72A2D"
                                              @click="copyICSContent()">复制下面这整段文本</a>，创建一个后缀名为
                  .ics 的文件，将这整段文本粘贴进去并保存。这与直接下载的 .ics 文件内容完全一致。
                </p>
                <v-textarea v-model="ICSContent" variant="outlined" readonly no-resize auto-grow
                            label="可能需要手动全选复制">
                </v-textarea>
              </div>
              <div v-if='troubleshootItem === 1' class="px-0">
                <p class="mb-4">
                  一般来说，下载的日历文件会保存在你指定的或者系统默认的下载文件夹中，这应该与你从浏览器上下载任意一个文件的过程完全一致。</p>
                <p class="mb-4">Nook Calendar 使用了一些较新但仍在标准之内，理应得到完整支持的浏览器特性，这使得 Nook
                  Calendar
                  可以完全在浏览器本地运行，而不需要后端服务。</p>
                <p class="mb-4">
                  不幸的是，尽管这些特性已经发布并应用多年，部分移动设备的浏览器和下载管理工具对这些特性的支持并不完善，它们可能会错误地将使用某些浏览器特性下载的文件保存在用户不可直接访问的目录中。</p>
                <p class="mb-4">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
                  你可以更换一款符合现代标准的浏览器，比如 Google Chrome、Safari 或者
                  Edge。但这不一定能够解决问题，因为有些设备的操作系统强制使用了统一的下载管理器，更换浏览器并不一定能绕过这个问题。
                </p>
                <p class="mb-4">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
                  你也可以用计算机的浏览器生成并下载日历文件后，把它发送到你的移动设备来使用。
                </p>
                <p class="mb-8">
                  <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon>
                  或者作为替代方案，你还可以<a href="javascript:void(0);" style="color: #A72A2D"
                                              @click="copyICSContent()">复制下面这整段文本</a>，创建一个后缀名为
                  .ics 的文件，将这整段文本粘贴进去并保存。这与直接下载的 .ics 文件内容完全一致。
                </p>
                <v-textarea v-model="ICSContent" variant="outlined" readonly no-resize auto-grow
                            label="可能需要手动全选复制">
                </v-textarea>
              </div>
              <div v-if='troubleshootItem === 2' class="px-0">
                <p class="mb-4">Nook Calendar 使用 .ics
                  文件来存储日历信息，这是一种绝大多数设备都可接受的日历文件格式。</p>
                <p class="mb-4">要将下载的文件导入到日历 App 中，你可以参考以下步骤。</p>
                <p class="mb-4" style="color: #A72A2D">你正在使用何种设备？</p>
                <v-expansion-panels variant="accordion" flat bg-color="transparent">
                  <v-expansion-panel>
                    <v-expansion-panel-title class="px-0">
                      <v-icon class="mx-2">mdi-microsoft-windows</v-icon>
                      Windows PC
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="mx-n2">
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
                        打开“日历”或“Outlook”
                      </p>
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
                        在“文件资源管理器”中找到下载的日历文件
                      </p>
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon>
                        将日历文件拖入“日历”或“Outlook”的日程窗格中
                      </p>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-title class="px-0">
                      <v-icon class="mx-2">mdi-apple</v-icon>
                      Apple 设备
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="mx-n2">
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
                        打开“文件”App，找到“下载”文件夹
                      </p>
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
                        找到下载的日历文件，用一根手指按住并拖动，同时用另一根手指返回主屏幕
                      </p>
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon>
                        将日历文件拖动到“日历”App 的图标上不动，此时“日历”App 将会启动，松开手指即可将文件导入日历
                      </p>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-title class="px-0">
                      <v-icon class="mx-2">mdi-android</v-icon>
                      Android 设备
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="mx-n2">
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon>
                        在文件管理器或下载管理器中找到下载的日历文件，点击打开
                      </p>
                      <p class="mb-4">
                        <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon>
                        在打开方式中选择“日历”App
                      </p>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-window-item>

          </v-window>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="好"
            @click=" showTroubleshootDialog = false; troubleshootPage = 0"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
p {
  font-family: 'AlibabaHealth', sans-serif;
}

.ac-text-headline {
  color: #986852;
}

.ac-text-subtitle {
  color: #986852;
  opacity: 0.8;
}

.check-icon {
  position: absolute;
  right: 4px;
  top: 4px;
}

.ac-btn {
  font-family: 'AlibabaHealth', sans-serif !important;
}
</style>
