# Kubernetes Configuration Files

This folder contains Kubernetes configuration files for deploying and managing applications.

## Folder Structure

```
/kubernetes
├── deployment.yaml   # Deployment configuration
├── service.yaml      # Service configuration
├── ingress.yaml      # Ingress configuration (if applicable)
├── configmap.yaml    # ConfigMap for application settings (optional)
├── secret.yaml       # Secret for sensitive data (optional)
```

## Usage

1. **Apply Configurations**  
    Use `kubectl` to apply the configuration files in this directory:
    ```bash
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    kubectl apply -f ingress.yaml  # If using ingress
    ```

2. **Verify Resources**  
    Check the status of your resources:
    ```bash
    kubectl get all
    ```

3. **Update Configurations**  
    Modify the YAML files as needed and reapply:
    ```bash
    kubectl apply -f <filename>.yaml
    ```

## Prerequisites

- Kubernetes cluster set up and running.
- `kubectl` CLI installed and configured.

## Notes

- Ensure sensitive data is stored securely using `secret.yaml`.
- Update resource limits and replicas in `deployment.yaml` based on your application's requirements.

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)