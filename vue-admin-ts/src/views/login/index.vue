<script setup lang="ts">
import PathAnimation from './components/path-animation.vue'
import LoginForm from './components/login-form.vue'
</script>

<template>
    <div class="login-page">
        <div class="login-page__left">
            <PathAnimation />
        </div>
        <div class="login-page__right">
            <LoginForm />
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-page {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    &__left {
        flex: 1;
        min-width: 0;
        position: relative;
        overflow: hidden;

        @media (max-width: 992px) {
            display: none;
        }
    }

    &__right {
        width: 40%;
        min-width: 480px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;

        @media (max-width: 992px) {
            width: 100%;
            min-width: unset;
        }

        @media (max-width: 480px) {
            padding: 24px;
        }
    }
}
</style>
