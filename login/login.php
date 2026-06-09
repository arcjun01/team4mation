<?php
error_reporting(E_ALL & ~E_DEPRECATED);
require_once 'gatorlock.php';
session_start();

$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $result = gatorlockLogin($email, $password);

    if ($result == SUCCESSFUL_LOGIN) {
        $_SESSION['user'] = $email;

        $token = base64_encode($email . ':' . time());

        $redirect = isset($_ENV['APP_URL']) ? $_ENV['APP_URL'] : 'http://localhost:5173';
        header('Location: ' . $redirect . '?token=' . $token);
        exit;

    } elseif ($result == USERNAME_DNE) {
        $error = "Email not found.";

    } elseif ($result == WRONG_PASSWORD) {
        $error = "Wrong password.";

    } elseif ($result == EMAIL_STATE_IS_INITIAL) {
        $error = "Please verify your email first.";

    } else {
        $error = "Login failed.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Team4mation Login</title>
    <link rel="stylesheet" href="login.css">
</head>

<body>

<div class="login-container">

    <h2>Login with GRC Email</h2>

    <?php if ($error): ?>
        <p class="error"><?php echo $error; ?></p>
    <?php endif; ?>

    <form method="POST">

        <input 
            type="email" 
            name="email" 
            placeholder="GRC Email" 
            required
        >

        <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required
        >

        <button type="submit">Login</button>
        <a href="https://gatorlock.greenrivertech.net/register">Don't have an account? Register</a>
    </form>

</div>

</body>
</html>