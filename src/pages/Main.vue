<script setup lang="ts">

import MyCard from "@/components/ACCard.vue";
import ACCardSubtitle from "@/components/ACCardSubtitle.vue";
import {Animals} from "@/assets/animals";
import {versions} from "@/assets/data/versions";
import {ref} from "vue";
import { createEvents, EventAttributes } from 'ics';
import {useDisplay} from "vuetify";

let selectedVersion = ref(12);
let selectedAnimals = ref([]);
let animalRule = ref("{年份}年{小动物的名字}生日")
let activityRule = ref("{年份}年{活动的名字}");
let exportYears = ref(5);
let showAboutDialog = ref(false);
let showGuideDialog = ref(false);

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
    case 'xs': return false
    case 'sm': return false
    case 'md': return true
    case 'lg': return true
    case 'xl': return true
    case 'xxl': return true
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

async function generateICS() {
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
  const fileName = 'acnh.ics';
  const file: File = await new Promise((resolve, reject) => {
    createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(new File([value], fileName, {type: 'text/calender'}));
    })
  })
  const url = URL.createObjectURL(file);

  // trying to assign the file URL to a window could cause cross-site
  // issues so this is a workaround using HTML5
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

</script>

<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="12" md="6" class="mx-2 mx-md-4 mt-16 mb-0 mt-md-16" >
        <p class="text-h2 text-md-h2 ac-text-headline" :style="useDesktopMode() ? {} : {width: 'min-content'}">Nook Calendar</p>
        <p class="text-subtitle-2 text-md-subtitle-1 ac-text-subtitle">记录岛屿活动和小动物的生日，并保存为日历文件。</p>
      </v-col>
      <v-col cols="12" md="4" class="mx-2 mx-md-4 mt-0 mb-0 mt-md-16" >
        <v-row v-if="useDesktopMode()">
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-lightbulb-variant" @click="showGuideDialog = true">
              教程
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-information-outline" @click="showAboutDialog = true">
              关于
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-github" @click="openURLInNewTab('#')">
              GitHub
            </v-btn>
          </v-col>
          <v-col cols="3" md="6">
            <v-btn class="ac-btn text-none" block variant="tonal" color="#986852" prepend-icon="mdi-book-open-variant-outline" @click="openURLInNewTab('#')">
              狸家
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="!useDesktopMode()">
            <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852" prepend-icon="mdi-lightbulb-variant" @click="showGuideDialog = true">
              教程
            </v-btn>
            <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852" prepend-icon="mdi-information-outline" @click="showAboutDialog = true">
              关于
            </v-btn>
            <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852" prepend-icon="mdi-github" @click="openURLInNewTab('#')">
              GitHub
            </v-btn>
            <v-btn class="ac-btn text-none mx-1 my-1" size="small" variant="tonal" color="#986852" prepend-icon="mdi-open-in-new" @click="openURLInNewTab('#')">
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
    <v-fab v-if="useDesktopMode()"
      position="sticky"
      location="bottom end"
      prepend-icon="mdi-check"
      class="me-16 mb-4"
      size="x-large"
      app
      appear
      color="secondary"
      rounded
      @click="generateICS"
    >
      生成
    </v-fab>
    <v-fab v-if="!useDesktopMode()"
           position="sticky"
           location="bottom end"
           icon="mdi-check"
           class="me-16 mb-4"
           size="large"
           app
           appear
           color="secondary"
           @click="generateICS"
    >
    </v-fab>
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
          <div class="mb-4">
            <p>
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-1-circle</v-icon> 勾选想要添加到日历的活动和小动物生日
            </p>
            <p>
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-2-circle</v-icon> 生成并下载日历文件
            </p>
            <p>
              <v-icon :style="{color: '#A72A2D !important'}">mdi-numeric-3-circle</v-icon> 添加日历文件到日历 App
            </p>
          </div>

          <v-img src="@/assets/guide.gif" max-height="400">

          </v-img>
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
            <v-list-item v-for="(dependency, i) in dependenciesList" :key="i" class="px-0" @click="openURLInNewTab(dependency.link)">
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
