<script lang="ts">
	import csg from './CSG.webp';
	import tru from './TRU.webp';
	import crashes from './crashes.webp';
</script>

<article id="about" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1>About Calm My Street</h1>
	<h2 id="what">What is this?</h2>
	<p>
		This is a tool to document your desires for changes to our streets. And get them heard by the
		city of Seattle.
	</p>
	<p>
		Calm My Street connects caring neighbors like you to safer streets advocates in your area, and
		helps us rally support for changing our unsafe roads.
	</p>
	<h2 id="how">How does this help?</h2>
	<p>
		You document ... then ... We organize ... then ... we talk to Seattle City Hall and you amplify
	</p>
	<h2 id="who">Who's behind this?</h2>
	<p>
		Hi, I'm Avery (she/her), I'm a local Seattleite living on Capitol Hill. I built calmmystreet.com
		to make this city better.
	</p>
	<p>
		Made with help and advice from a few local advocacy orgs.
		<span class="flex align-middle justify-center min-h-0">
			<img src={csg} width="30%" class="mr-2" alt="Central Seattle Greenways Logo" />
			<img src={tru} width="69%" class="ml-2" alt="Transit Riders Union Logo" />
		</span>
	</p>
	<p>
		In 2025, I worked with Seattle's City Council to make street safety improvements in my
		neighborhood. After successfully making these streets safer, I wanted to share that process
		throughout the city. Our streets are not good as they are, and I want to find the other people
		who feel that way
	</p>
	<div>
		<div class="float-end w-xs border mx-1">
			<img
				src={crashes}
				class="mt-0 mb-0"
				alt="Crash deaths in Seattle 2015-2024"
				title="Crash deaths in Seattle 2015-2024"
			/>
			<p class="mt-0 mb-0">
				Source: <a class="text-blue-600" href="https://wtsc.wa.gov/"
					>Washington Traffic Safety Commission</a
				>
			</p>
		</div>
		<p>
			Too many people are hurt and killed by cars, and I want to help Seattle dream bigger. Traffic
			deaths are preventable, and we should be making the changes required to meet our existing <a
				class="text-blue-600 underline"
				href="https://www.seattle.gov/transportation/projects-and-programs/safety-first/vision-zero"
				>commitment of zero traffic deaths on Seattle streets by 2030</a
			>. Without improving our roads, we will not reach our goal. In 2024 we had 43 deaths on
			Seattle's roads.
		</p>
	</div>
	<h2 id="safer">How do we make streets safer?</h2>
	<ul class="list-disc">
		<li>Keep cars from using our neighborhood streets as shortcuts</li>
		<li>Make it easier and safer to cross the street</li>
		<li>Traffic calming on major thoroughfares</li>
		<li>Prioritize transit and other alternatives to driving</li>
		<li>
			Allow corner stores and similar throughout the city so you can grab what you need without
			getting in a car
		</li>
	</ul>
	<p>
		Seattle has a list of proven strategies to make our streets safer. Check out their list <a
			class="text-blue-600 underline"
			href="https://www.seattle.gov/transportation/projects-and-programs/safety-first/vision-zero/safer-streets"
			>on seattle.gov</a
		>
	</p>
	<h2 id="not">What are we not?</h2>
	<ul class="list-disc">
		<li>
			Calm My Street has no intentions of preventing you from driving from anywhere to anywhere
			inside Seattle
		</li>
		<li>Calm My Street is not an official CIty of Seattle site</li>
	</ul>
	<h2 id="connect">Get involved</h2>
	<p>
		Send an email to <a class="text-blue-600 underline" href="mailto:calmmystreet@gmail.com"
			>calmmystreet@gmail.com</a
		>
	</p>
	<h2 id="privacy">Privacy</h2>
	<p>
		Calm My Street will never share your email. We will show parts of your reports on maps
		throughout the site, and share reports with the City of Seattle.
	</p>
	<p>We will allow advocates to email you based on your choice when reporting.</p>
	<ul class="list-disc">
		<li>
			I want to hear about calmer streets in this neighborhood
			<p class="pl-10">
				Based on where you've used Calm My Street to report street issues, you'll hear about ways to
				get involved in those areas.
			</p>
		</li>
		<li>
			Update me about calmer streets citywide
			<p class="pl-10">
				You'll receive information about ways to get involved in street calming projects happening
				across the entire city of Seattle.
			</p>
		</li>
		<li>
			Tell me everything
			<p class="pl-10">
				In addition to ways to get involved, you'll hear success stories and status updates about
				the project
			</p>
		</li>
	</ul>
</article>
