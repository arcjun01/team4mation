<?php
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

        header('Location: http://localhost:5173?token=' . $token);
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

    </form>

</div>

</body>
</html>