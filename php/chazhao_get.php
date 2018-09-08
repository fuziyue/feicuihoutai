<?php
header('content-type:text/html;charset=utf-8');
//echo phpinfo();
$username = $_GET['user'];

$users = array('梁慧','张彬','少天阔');
echo $username;

if( in_array( $username , $users ) ){
	echo '用户名已经被注册了！';
}else{
	echo '用户名可以注册';
}


?>