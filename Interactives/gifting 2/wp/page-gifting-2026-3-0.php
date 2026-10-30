<?php
/*
Template Name: Gifting 2026
*/

// Gifting Guide 2026. Built in this repo (gifting 2/) and packaged by wp/build.py into
// assets/assets_3_0/gifting-2026/ and template-parts/template-3-0/gifting-2026-views.php.
// Views are picked client-side with ?view= (landing, philosophies, recommendations).
// Backend unchanged: gifting_2026_* in includes/functions.php (request code, verify code, save / get answers, sign out).

$gk26_dir     = get_stylesheet_directory() . '/assets/assets_3_0/gifting-2026';
$gk26_url     = assetsUrl . '/assets/assets_3_0/gifting-2026';
$gk26_version = file_exists( $gk26_dir . '/VERSION' ) ? trim( file_get_contents( $gk26_dir . '/VERSION' ) ) : '1';

// The page's CSS is scoped under body.gifting-2026 .gk
add_filter( 'body_class', function ( $classes ) {
	$classes[] = 'gifting-2026';
	return $classes;
} );

// The site's login script drives the main login modal, which this page doesn't have (footer-3-0.php skips
// it here); the page's own sign-in (js/gifting/signin.js) replaces it.
add_action( 'wp_footer', function () {
	wp_dequeue_script( 'multi-login-signup-js' );
}, 15 );

get_template_part( 'header-3-0' );

$gk26_user = is_user_logged_in() ? wp_get_current_user()->user_email : null;
?>

<link rel="stylesheet" href="<?php echo esc_url( $gk26_url . '/gifting-2026.css?ver=' . $gk26_version ); ?>">

<script>
	window.gk26Config = <?php echo wp_json_encode( array(
		'dataUrl'      => $gk26_url . '/data/gifting-2026.json?ver=' . $gk26_version,
		'assetsUrl'    => $gk26_url,
		'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
		'authNonce'    => wp_create_nonce( 'gifting_2026_auth' ),
		'answersNonce' => wp_create_nonce( 'gifting_2026_answers' ),
		'user'         => $gk26_user,
		'baseUrl'      => get_permalink(),
	) ); ?>;
</script>
<script src="<?php echo esc_url( $gk26_url . '/js/tag-theme.js?ver=' . $gk26_version ); ?>"></script>
<script src="<?php echo esc_url( $gk26_url . '/js/gift-tag.js?ver=' . $gk26_version ); ?>"></script>

<?php get_template_part( 'template-parts/template-3-0/gifting-2026-views' ); ?>

<script type="module" src="<?php echo esc_url( $gk26_url . '/js/app.js?ver=' . $gk26_version ); ?>"></script>

<!-- App QR codes for the menu's "Download now" (desktop); on other pages this lives in the main login modal -->
<div class="modal fade" id="gifting-2026-app-modal" tabindex="-1" role="dialog" aria-labelledby="gifting-2026-app-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content" style="padding:24px;text-align:center;">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="position:absolute;right:16px;top:12px;">&times;</button>
			<h2 id="gifting-2026-app-title" style="font-size:22px;margin:8px 0;">Download The Ken’s app</h2>
			<p style="font-size:15px;margin:0 0 16px;">Scan the QR code to listen to premium podcasts, read stories offline, customise your experience, and more</p>
			<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">
				<a href="https://apps.apple.com/in/app/the-ken/id1282944688" target="_blank" rel="noopener"><img src="https://the-ken.com/wp-content/themes/the-ken/assets/images/app/qr-codes/the-ken-app-ios-qr-code-updated.png" alt="QR code for the iOS app" width="140" height="140" /><br />iOS</a>
				<a href="https://play.google.com/store/apps/details?id=com.ken.core" target="_blank" rel="noopener"><img src="https://the-ken.com/wp-content/themes/the-ken/assets/images/app/qr-codes/the-ken-app-android-qr-code-updated.png" alt="QR code for the Android app" width="140" height="140" /><br />Android</a>
			</div>
		</div>
	</div>
</div>

<script>
// Stand-ins for what multi-login-signup.js does on other pages (it isn't loaded here)
(function () {
	var LOGIN = '[data-target="#login-signup-otp-modal"], [data-bs-target="#login-signup-otp-modal"]';

	// Run fn once any open Bootstrap 4 modal (e.g. the header menu) has finished closing
	function afterOpenModalCloses(fn) {
		var $open = jQuery('.modal.show');
		if ($open.length) {
			$open.last().one('hidden.bs.modal', fn);
		} else {
			fn();
		}
	}

	// Header "Sign in" opens the page's own sign-in (js/app.js listens for this event)
	document.addEventListener('click', function (e) {
		var trigger = e.target.closest && e.target.closest(LOGIN);
		if (!trigger) { return; }
		e.preventDefault();
		afterOpenModalCloses(function () {
			document.dispatchEvent(new CustomEvent('gifting:open-answers'));
		});
	});

	// Menu "Download now" (desktop) shows the app QR codes
	document.addEventListener('click', function (e) {
		var trigger = e.target.closest && e.target.closest('.app-adoption-download-app-modal');
		if (!trigger) { return; }
		e.preventDefault();
		afterOpenModalCloses(function () {
			jQuery('#gifting-2026-app-modal').modal('show');
		});
	});
})();
</script>

<?php get_template_part( 'footer-3-0' ); ?>
