Write-Host "Starting local registry..."
docker run -d -p 5000:5000 --restart=always --name registry registry:2
Start-Sleep -Seconds 5

Write-Host "Tagging images..."
docker tag event-booking-user-service:latest localhost:5000/user-service:latest
docker tag event-booking-event-service:latest localhost:5000/event-service:latest
docker tag event-booking-booking-service:latest localhost:5000/booking-service:latest
docker tag event-booking-notification-service:latest localhost:5000/notification-service:latest
docker tag event-booking-frontend:latest localhost:5000/frontend:latest

Write-Host "Pushing images to local registry..."
docker push localhost:5000/user-service:latest
docker push localhost:5000/event-service:latest
docker push localhost:5000/booking-service:latest
docker push localhost:5000/notification-service:latest
docker push localhost:5000/frontend:latest

Write-Host "Done! You can now run your Kubernetes deployment." 