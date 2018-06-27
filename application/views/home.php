<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="description" content="iExcuse">
	<meta name="author" content="solutionportal">
	<!-- <base href="/"> -->

	<title>iExcuse</title>
	<link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">
	<link rel="stylesheet" href="/public/dist/main.css" />
</head>
<body>
	<div ng-cloak ng-app="app" class="app" ng-strict-di
		id="degree-app" layout="row" ng-class="{'body-full': bodyFull}"
		custom-page ng-controller="AppCtrl">

		<!-- sidenav -->
		<md-sidenav class="md-sidenav-left"
			md-component-id="sidenav-left"
			md-is-locked-open="$mdMedia('min-width: 960px')"

			ng-include=" '/public/views/partials/sidenav.html' ">

		</md-sidenav>

		<div class="content-wrapper" flex layout>
			<!-- header -->
			<header class="site-head" ng-include=" '/public/views/partials/header.html' ">

			</header>

			<div class="main-content" layout-padding ng-view>
			</div>
		</div>

		<!-- hidden search container -->
		<div class="search-container" ng-show="isSearchOpen">
			<md-icon class="ion-ios-close-circle-outline" ng-click="closeSearch()"></md-icon>
			<input type="search" class="search-input" placeholder="Type to search..." />
		</div>



	</div>


	<!-- libs.js, common.js -->
	<script src="/public/dist/libs.js"></script>
    <script src="/public/dist/main.js"></script>
</body>
</html>
