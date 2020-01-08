<template>
    <div style="display: flex; flex-direction: column; align-items: center; max-width: 80%; margin: auto;">
        <div class="my-container">
            <div class="container">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" :src="video.path" allowfullscreen/>
                </div>
            </div>
        </div>
        <div class="col" style="border-bottom: solid 1px black; min-width: 100%;">
            <div class="font-weight-bold display-4">{{video.name}}</div>
            <div class="row align-items-baseline justify-content-between">
                <div class="mr-auto">{{video.numberOfViews}} просмотров (последнее обновление {{video.updatedAt}})</div>
                <div class="form-group">
                    <button class="btn" v-bind:class="{'btn-success': isLiked, 'btn-default': !isLiked}" @click="like">Понравилось {{rating.liked}}</button>
                    <button class="btn" v-bind:class="{'btn-danger': isDisliked, 'btn-default': !isDisliked}" @click="dislike">Не понравилось {{rating.disliked}}</button>
                </div>
            </div>
        </div>

        <div class="col" style="border-bottom: solid 1px black; min-width: 100%; ">
            <div class="row">
                <div class="mr-auto">Добавил пользователь:
                    <router-link :to="{name: 'user_page', params:{username:video.author}}">{{video.author}}</router-link>
                </div >
            </div>
            <div class="row">
                Описание: &#160;
                <div v-if="video.description !== null && video.description !== ''">
                    {{video.description}}
                </div>
                <div v-else>
                    У видео нет описания
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { HTTP } from "../components/http";
    export default {
        name: 'Video',
        props: ['id'],
        data () {
            return{
                video: {
                    id: 0,
                    name: "",
                    path: "",
                    author: "",
                    description: "",
                    preview: "",
                    numberOfViews: 0,
                    updatedAt: ""
                },
                rating: {
                    liked: 0,
                    disliked: 0
                },
                isLiked: false,
                isDisliked: false
            }
        },

        created() {
            HTTP.get('/videos/view?id=' + this.$props.id).then(response => (this.video = response.data))
            HTTP.get('/videos/rating?id=' + this.$props.id).then(response => (this.rating = response.data))
            if(this.username() !== "")
            {
                HTTP.get('/videos/liked?id=' + this.$props.id).then(response => {
                    if(response.data.liked === 'like')
                        this.isLiked = true;
                    else if(response.data.liked === 'dislike')
                        this.isDisliked = true;
                })
            }
        },

        methods: {
            like : function () {
                if(this.username() === "")
                    this.$parent.show_Authoriztion();//к сожалению с inject не разобрался (provide в App добавлял, но все равно не хочет работать)
                if(this.username() !== "")
                {
                    if(this.isDisliked) this.rating.disliked -= 1;
                    this.rating.liked += 1;

                    this.isLiked = true;
                    this.isDisliked = false;
                    HTTP.post('/videos/liked?id=' + this.$props.id, {value: 1});
                }
            },
            dislike : function () {
                if(this.username() === "")
                    this.$parent.show_Authoriztion();
                if(this.username() !== "")
                {
                    if(this.isLiked) this.rating.liked -= 1;
                    this.rating.disliked += 1;

                    this.isLiked = false;
                    this.isDisliked = true;
                    HTTP.post('/videos/liked?id=' + this.$props.id, {value : 0});
                }
            },
            username : function () {
                return this.$root.username;
            }
        }
    }

</script>

